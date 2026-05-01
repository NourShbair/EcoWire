import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import * as fc from 'fast-check';
import LoginPage from './LoginPage.jsx';
import { authService } from '../../services/authService.js';

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock authService
vi.mock('../../services/authService.js', () => ({
    authService: {
        login: vi.fn(),
    },
}));

const renderLoginPage = () =>
    render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>
    );

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    vi.restoreAllMocks();
});

// ─── Unit Tests (5.4) ────────────────────────────────────────────────────────

describe('LoginPage — unit tests', () => {
    it('renders username and password fields', () => {
        renderLoginPage();
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('renders the Sign In submit button', () => {
        renderLoginPage();
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('shows inline validation errors when both fields are empty on submit', async () => {
        renderLoginPage();
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
        expect(await screen.findByText(/username is required/i)).toBeInTheDocument();
        expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
        expect(authService.login).not.toHaveBeenCalled();
    });

    it('shows error alert on failed login (mock API returning error)', async () => {
        const errorMessage = 'Invalid credentials';
        authService.login.mockRejectedValueOnce({
            response: { data: { message: errorMessage } },
        });

        renderLoginPage();
        await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
        await userEvent.type(screen.getByLabelText(/password/i), 'testpass');
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        expect(await screen.findByRole('alert')).toHaveTextContent(errorMessage);
    });

    it('submit button is disabled during loading', async () => {
        // Make login hang so we can observe the loading state
        authService.login.mockImplementation(
            () => new Promise(() => {}) // never resolves
        );

        renderLoginPage();
        await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
        await userEvent.type(screen.getByLabelText(/password/i), 'testpass');
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled();
        });
    });

    it('navigates to / on successful login', async () => {
        authService.login.mockResolvedValueOnce({ token: 'tok', role: 'AGENT' });

        renderLoginPage();
        await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
        await userEvent.type(screen.getByLabelText(/password/i), 'testpass');
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('clears server error when user types in a field', async () => {
        authService.login.mockRejectedValueOnce({
            response: { data: { message: 'Bad credentials' } },
        });

        renderLoginPage();
        await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
        await userEvent.type(screen.getByLabelText(/password/i), 'testpass');
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        expect(await screen.findByRole('alert')).toBeInTheDocument();

        // Typing in username should dismiss the alert
        await userEvent.type(screen.getByLabelText(/username/i), 'x');
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('uses generic fallback message when error has no message field', async () => {
        authService.login.mockRejectedValueOnce({ response: { data: {} } });

        renderLoginPage();
        await userEvent.type(screen.getByLabelText(/username/i), 'testuser');
        await userEvent.type(screen.getByLabelText(/password/i), 'testpass');
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

        expect(await screen.findByRole('alert')).toHaveTextContent(
            'An unexpected error occurred. Please try again.'
        );
    });
});

// ─── Property 6: Auth form calls API with matching payload ───────────────────
// Feature: auth-pages, Property 6: Auth form calls API with matching payload
// Validates: Requirements 2.2

describe('Property 6: Auth form calls API with matching payload', () => {
    it('login form submits exactly the values entered in the fields', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
                fc.string({ minLength: 1, maxLength: 100 }),
                async (username, password) => {
                    vi.clearAllMocks();
                    authService.login.mockResolvedValueOnce({ token: 'tok', role: 'AGENT' });

                    const { unmount } = render(
                        <MemoryRouter>
                            <LoginPage />
                        </MemoryRouter>
                    );

                    // Use fireEvent for reliable value setting with arbitrary strings
                    fireEvent.change(screen.getByLabelText(/username/i), {
                        target: { value: username },
                    });
                    fireEvent.change(screen.getByLabelText(/password/i), {
                        target: { value: password },
                    });
                    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

                    await waitFor(() => {
                        expect(authService.login).toHaveBeenCalledWith(username, password);
                    });

                    unmount();
                }
            ),
            { numRuns: 50 }
        );
    });
});

// ─── Property 7: Server error message is displayed ───────────────────────────
// Feature: auth-pages, Property 7: Server error message is displayed
// Validates: Requirements 2.5

describe('Property 7: Server error message is displayed', () => {
    it('renders the exact server error message in the alert', async () => {
        await fc.assert(
            fc.asyncProperty(
                fc.string({ minLength: 1, maxLength: 200 }),
                async (errorMessage) => {
                    vi.clearAllMocks();
                    authService.login.mockRejectedValueOnce({
                        response: { data: { message: errorMessage } },
                    });

                    const { unmount } = render(
                        <MemoryRouter>
                            <LoginPage />
                        </MemoryRouter>
                    );

                    fireEvent.change(screen.getByLabelText(/username/i), {
                        target: { value: 'user' },
                    });
                    fireEvent.change(screen.getByLabelText(/password/i), {
                        target: { value: 'pass' },
                    });
                    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

                    await waitFor(() => {
                        const alert = screen.queryByRole('alert');
                        expect(alert).not.toBeNull();
                        expect(alert.textContent).toBe(errorMessage);
                    });

                    unmount();
                }
            ),
            { numRuns: 50 }
        );
    });
});

// ─── Property 9: Login validation rejects empty fields ───────────────────────
// Feature: auth-pages, Property 9: Login validation rejects empty fields without a network request
// Validates: Requirements 2.7

describe('Property 9: Login validation rejects empty fields without a network request', () => {
    it('does not call API and shows validation message when at least one field is empty', async () => {
        // Arbitrarily generate states where at least one field is empty
        await fc.assert(
            fc.asyncProperty(
                fc.oneof(
                    // username empty, password non-empty
                    fc.record({
                        username: fc.constant(''),
                        password: fc.string({ minLength: 1, maxLength: 50 }),
                    }),
                    // username non-empty, password empty
                    fc.record({
                        username: fc.string({ minLength: 1, maxLength: 50 }).filter((s) => s.trim().length > 0),
                        password: fc.constant(''),
                    }),
                    // both empty
                    fc.record({
                        username: fc.constant(''),
                        password: fc.constant(''),
                    })
                ),
                async ({ username, password }) => {
                    vi.clearAllMocks();

                    const { unmount } = render(
                        <MemoryRouter>
                            <LoginPage />
                        </MemoryRouter>
                    );

                    if (username) {
                        fireEvent.change(screen.getByLabelText(/username/i), {
                            target: { value: username },
                        });
                    }
                    if (password) {
                        fireEvent.change(screen.getByLabelText(/password/i), {
                            target: { value: password },
                        });
                    }

                    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

                    // No API call
                    expect(authService.login).not.toHaveBeenCalled();

                    // At least one validation message visible
                    const invalidFeedbacks = document.querySelectorAll('.invalid-feedback');
                    const visibleMessages = Array.from(invalidFeedbacks).filter(
                        (el) => el.textContent.trim().length > 0
                    );
                    expect(visibleMessages.length).toBeGreaterThan(0);

                    unmount();
                }
            ),
            { numRuns: 50 }
        );
    });
});

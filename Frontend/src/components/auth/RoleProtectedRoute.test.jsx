import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { authService } from '../../services/authService.js';
import { canCreatePolicy, canEditPolicy } from '../../services/permissionService.js';

// Import the RoleProtectedRoute component from App.jsx
// Since it's defined inline, we'll create a standalone version for testing
import { Navigate } from 'react-router-dom';

function RoleProtectedRoute({ children, permission, fallback = '/policies' }) {
  const currentRole = authService.getRole();
  
  if (!currentRole || !permission(currentRole)) {
    return <Navigate to={fallback} replace />;
  }
  
  return children;
}

// Mock the authService
vi.mock('../../services/authService.js', () => ({
  authService: {
    getRole: vi.fn(),
  }
}));

describe('RoleProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render children when user has required permission', () => {
    authService.getRole.mockReturnValue('AGENT');
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route 
            path="/" 
            element={
              <RoleProtectedRoute permission={canCreatePolicy}>
                <div data-testid="protected-content">Protected Content</div>
              </RoleProtectedRoute>
            } 
          />
          <Route path="/policies" element={<div data-testid="fallback">Fallback</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should redirect to fallback when user lacks required permission', () => {
    authService.getRole.mockReturnValue('CUSTOMER');
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route 
            path="/" 
            element={
              <RoleProtectedRoute permission={canCreatePolicy}>
                <div data-testid="protected-content">Protected Content</div>
              </RoleProtectedRoute>
            } 
          />
          <Route path="/policies" element={<div data-testid="fallback">Fallback</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should redirect to fallback when user has no role', () => {
    authService.getRole.mockReturnValue(null);
    
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route 
            path="/" 
            element={
              <RoleProtectedRoute permission={canCreatePolicy}>
                <div data-testid="protected-content">Protected Content</div>
              </RoleProtectedRoute>
            } 
          />
          <Route path="/policies" element={<div data-testid="fallback">Fallback</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('should work with edit permission for ADMIN role', () => {
    authService.getRole.mockReturnValue('ADMIN');
    
    render(
      <MemoryRouter initialEntries={['/edit/123']}>
        <Routes>
          <Route 
            path="/edit/123" 
            element={
              <RoleProtectedRoute permission={canEditPolicy}>
                <div data-testid="edit-content">Edit Content</div>
              </RoleProtectedRoute>
            } 
          />
          <Route path="/policies" element={<div data-testid="fallback">Fallback</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('edit-content')).toBeInTheDocument();
  });

  it('should redirect read-only roles from edit routes', () => {
    authService.getRole.mockReturnValue('UNDERWRITER');
    
    render(
      <MemoryRouter initialEntries={['/edit/123']}>
        <Routes>
          <Route 
            path="/edit/123" 
            element={
              <RoleProtectedRoute permission={canEditPolicy}>
                <div data-testid="edit-content">Edit Content</div>
              </RoleProtectedRoute>
            } 
          />
          <Route path="/policies" element={<div data-testid="fallback">Fallback</div>} />
        </Routes>
      </MemoryRouter>
    );
    
    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-content')).not.toBeInTheDocument();
  });
});
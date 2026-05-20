package com.ecowire.ecowire.security;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // ← CORS first
                .csrf(csrf -> csrf.disable())
                .headers(headers -> headers.frameOptions(frame -> frame.disable()))
                .sessionManagement(sm ->
                        sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write(
                                    "{\"status\":401,\"error\":\"Unauthorized\",\"message\":\"Authentication required\"}");
                        })
                )
                .authorizeHttpRequests(auth -> auth

                        // ── Public endpoints (no auth required) ──────────────
                        .requestMatchers(
                                "/api/auth/signup",
                                "/api/auth/login",
                                "/api/health",
                                "/api/ecoscore/calculate",
                                "/api/sustainability/report",
                                "/error"
                        ).permitAll()

                        // ── Organization list — public GET only ───────────────
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/organizations")
                                .permitAll()

                        // ── Policy creation — AGENT and ADMIN only ────────────
                        .requestMatchers(org.springframework.http.HttpMethod.POST, "/api/policies")
                                .hasAnyRole("AGENT", "ADMIN")

                        // ── Policy update/delete — AGENT and ADMIN only ───────
                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/policies/**")
                                .hasAnyRole("AGENT", "ADMIN")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/policies/**")
                                .hasAnyRole("AGENT", "ADMIN")

                        // ── Carbon emissions — REPORTING and ADMIN only ───────
                        .requestMatchers("/api/policies/*/carbon-emissions")
                                .hasAnyRole("REPORTING", "ADMIN")

                        // ── Climate risk — UNDERWRITER, REPORTING, ADMIN ──────
                        .requestMatchers("/api/policies/*/climate-risk")
                                .hasAnyRole("UNDERWRITER", "REPORTING", "ADMIN")

                        // ── Nature data — UNDERWRITER, REPORTING, ADMIN ───────
                        .requestMatchers("/api/policies/*/nature-data")
                                .hasAnyRole("UNDERWRITER", "REPORTING", "ADMIN")

                        // ── ESG metrics — UNDERWRITER, REPORTING, ADMIN ───────
                        .requestMatchers("/api/policies/*/esg-metrics")
                                .hasAnyRole("UNDERWRITER", "REPORTING", "ADMIN")

                        // ── Detailed sustainability report — REPORTING, ADMIN ─
                        .requestMatchers("/api/sustainability/report/detailed")
                                .hasAnyRole("REPORTING", "ADMIN")

                        // ── All other requests — must be authenticated ─────────
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Allow React dev server and production
        config.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5176",
                "http://localhost:5177",
                "https://ecowire.site",
                "https://www.ecowire.site"
        ));

        // Allow all standard HTTP methods including OPTIONS (preflight)
        config.setAllowedMethods(List.of(
                "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));

        // Allow all headers
        config.setAllowedHeaders(List.of("*"));

        // Allow credentials (needed for Authorization header)
        config.setAllowCredentials(true);

        // Cache preflight response for 1 hour
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}

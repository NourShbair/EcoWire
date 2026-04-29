-- Base policies table
CREATE TABLE policies (
                          policy_id     VARCHAR(36) PRIMARY KEY,
                          customer_name VARCHAR(255) NOT NULL,
                          contact_info  VARCHAR(255) NOT NULL,
                          policy_type   VARCHAR(20)  NOT NULL CHECK (policy_type IN ('AUTO', 'HOME', 'PROPERTY')),
                          created_date  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
                          updated_date  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_policies_type     ON policies(policy_type);
CREATE INDEX idx_policies_customer ON policies(customer_name);

-- Auto policies
CREATE TABLE auto_policies (
                               auto_policy_id VARCHAR(36) PRIMARY KEY,
                               policy_id      VARCHAR(36) NOT NULL UNIQUE,
                               vehicle_id     VARCHAR(100) NOT NULL,
                               vehicle_type   VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('PETROL','DIESEL','HYBRID','ELECTRIC')),
                               annual_mileage VARCHAR(20) NOT NULL CHECK (annual_mileage IN ('LOW','MEDIUM','HIGH')),
                               usage_type     VARCHAR(20) NOT NULL CHECK (usage_type IN ('PERSONAL','BUSINESS','COMMERCIAL')),
                               fuel_efficiency VARCHAR(20) NOT NULL CHECK (fuel_efficiency IN ('LOW','MEDIUM','HIGH')),
                               FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE
);

CREATE INDEX idx_auto_policies_policy ON auto_policies(policy_id);

-- Home policies
CREATE TABLE home_policies (
                               home_policy_id              VARCHAR(36)  PRIMARY KEY,
                               policy_id                   VARCHAR(36)  NOT NULL UNIQUE,
                               property_address            VARCHAR(500) NOT NULL,
                               energy_rating               VARCHAR(1)   NOT NULL CHECK (energy_rating IN ('A','B','C','D','E','F','G')),
                               has_solar_panels            BOOLEAN      NOT NULL,
                               insulation_type             VARCHAR(20)  NOT NULL CHECK (insulation_type IN ('NONE','BASIC','STANDARD','ADVANCED')),
                               heating_system              VARCHAR(20)  NOT NULL CHECK (heating_system IN ('GAS','OIL','ELECTRIC','HEAT_PUMP','GEOTHERMAL')),
                               water_conservation_features TEXT,
                               FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE
);

CREATE INDEX idx_home_policies_policy ON home_policies(policy_id);

-- Property policies
CREATE TABLE property_policies (
                                   property_policy_id VARCHAR(36)  PRIMARY KEY,
                                   policy_id          VARCHAR(36)  NOT NULL UNIQUE,
                                   property_address   VARCHAR(500) NOT NULL,
                                   property_type      VARCHAR(20)  NOT NULL CHECK (property_type IN ('COMMERCIAL','RESIDENTIAL')),
                                   certifications     TEXT,
                                   energy_systems     VARCHAR(20)  NOT NULL CHECK (energy_systems IN ('GRID','SOLAR','WIND','HYBRID','GEOTHERMAL')),
                                   waste_management   VARCHAR(30)  NOT NULL CHECK (waste_management IN ('NONE','BASIC_RECYCLING','ADVANCED_RECYCLING','COMPOSTING','ZERO_WASTE')),
                                   building_age       INTEGER      NOT NULL,
                                   FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE
);

CREATE INDEX idx_property_policies_policy ON property_policies(policy_id);

-- Eco scores
CREATE TABLE eco_scores (
                            score_id         VARCHAR(36) PRIMARY KEY,
                            policy_id        VARCHAR(36) NOT NULL,
                            total_score      INTEGER     NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
                            score_breakdown  JSONB       NOT NULL,
                            calculated_date  TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE
);

CREATE INDEX idx_eco_scores_policy ON eco_scores(policy_id);
CREATE INDEX idx_eco_scores_date   ON eco_scores(calculated_date DESC);

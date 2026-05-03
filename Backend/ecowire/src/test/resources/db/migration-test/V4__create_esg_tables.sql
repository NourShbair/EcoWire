-- V4: Create ESG extension tables

CREATE TABLE carbon_emissions (
    emissions_id    VARCHAR(36)   PRIMARY KEY,
    policy_id       VARCHAR(36)   NOT NULL UNIQUE,
    scope1_kg       DECIMAL(12,2) NOT NULL DEFAULT 0,
    scope2_kg       DECIMAL(12,2) NOT NULL DEFAULT 0,
    scope3_kg       DECIMAL(12,2) NOT NULL DEFAULT 0,
    reporting_year  INTEGER       NOT NULL,
    calculated_date TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE
);

CREATE INDEX idx_carbon_emissions_policy ON carbon_emissions(policy_id);

CREATE TABLE climate_risk (
    climate_risk_id         VARCHAR(36)  PRIMARY KEY,
    policy_id               VARCHAR(36)  NOT NULL UNIQUE,
    avg_temperature_celsius DECIMAL(5,2),
    max_wind_speed_kph      DECIMAL(7,2),
    flood_risk_level        VARCHAR(10)  NOT NULL CHECK (flood_risk_level IN ('LOW','MEDIUM','HIGH','VERY_HIGH')),
    data_source             VARCHAR(255),
    recorded_date           TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE
);

CREATE INDEX idx_climate_risk_policy ON climate_risk(policy_id);

CREATE TABLE nature_data (
    nature_data_id     VARCHAR(36)  PRIMARY KEY,
    policy_id          VARCHAR(36)  NOT NULL UNIQUE,
    water_stress_level VARCHAR(10)  NOT NULL CHECK (water_stress_level IN ('LOW','MEDIUM','HIGH','VERY_HIGH')),
    soil_health_score  INTEGER      CHECK (soil_health_score BETWEEN 0 AND 100),
    biodiversity_index DECIMAL(5,3),
    data_source        VARCHAR(255),
    recorded_date      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE
);

CREATE INDEX idx_nature_data_policy ON nature_data(policy_id);

CREATE TABLE esg_metrics (
    esg_metrics_id            VARCHAR(36)   PRIMARY KEY,
    policy_id                 VARCHAR(36)   NOT NULL UNIQUE,
    annual_energy_kwh         DECIMAL(14,2),
    renewable_energy_pct      DECIMAL(5,2)  CHECK (renewable_energy_pct BETWEEN 0 AND 100),
    workforce_diversity_score INTEGER       CHECK (workforce_diversity_score BETWEEN 0 AND 100),
    reporting_year            INTEGER       NOT NULL,
    recorded_date             TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES policies(policy_id) ON DELETE CASCADE
);

CREATE INDEX idx_esg_metrics_policy ON esg_metrics(policy_id);

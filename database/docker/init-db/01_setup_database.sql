-- Drop tables in correct order to handle foreign key constraints
DROP TABLE IF EXISTS "public"."PreInvoiceDetail";
DROP TABLE IF EXISTS "public"."PreInvoice";
DROP TABLE IF EXISTS "public"."LeaveDays";
DROP TABLE IF EXISTS "public"."Project";
DROP TABLE IF EXISTS "public"."People";
DROP TABLE IF EXISTS "public"."Contact";
DROP TABLE IF EXISTS "public"."Client";
DROP TABLE IF EXISTS "public"."JobTitle";
DROP TABLE IF EXISTS "public"."Role";
DROP TABLE IF EXISTS "public"."Seniority";
DROP TABLE IF EXISTS "public"."SkillLevel";
DROP TABLE IF EXISTS "public"."TechnicalsStacks";
DROP TABLE IF EXISTS "public"."Price";
DROP TABLE IF EXISTS "public"."Holidays";
DROP TABLE IF EXISTS "public"."HealthInstitution";
DROP TABLE IF EXISTS "public"."CurrencyType";
DROP TABLE IF EXISTS "public"."AFPInstitution";
DROP TABLE IF EXISTS "public"."CurrencyHistory";

-- Create tables
CREATE TABLE "public"."AFPInstitution" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL UNIQUE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."CurrencyType" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(50) NOT NULL,
    "symbol" VARCHAR(6) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."Client" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "currency_type_id" INTEGER REFERENCES "public"."CurrencyType"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "billable_day" DECIMAL(10,2) DEFAULT 0,
    "rut" VARCHAR(20),
    "address" TEXT,
    "company_name" VARCHAR(255),
    "margin_percentage" DECIMAL(10,2) DEFAULT 0.00,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."Contact" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255),
    "email" VARCHAR(255),
    "phone" VARCHAR(50),
    "client_id" INTEGER REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."HealthInstitution" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."Holidays" (
    "id" SERIAL PRIMARY KEY,
    "date" DATE NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."JobTitle" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."Role" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."Seniority" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."SkillLevel" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "level" VARCHAR(2) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."TechnicalsStacks" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."Price" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "value" DECIMAL(12,2) NOT NULL,
    "currency_type" INTEGER REFERENCES "public"."CurrencyType"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."People" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "dni" VARCHAR(50),
    "corporate_name" VARCHAR(50),
    "corporate_email" VARCHAR(255),
    "contract_type" VARCHAR(30),
    "contract_start" DATE,
    "contract_end" DATE,
    "contract_client_end" DATE,
    "role_id" INTEGER REFERENCES "public"."Role"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "is_active" BOOLEAN,
    "causal" VARCHAR(255),
    "reason" VARCHAR(255),
    "client_id" INTEGER REFERENCES "public"."Client"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "remote" VARCHAR(50),
    "job_title_id" INTEGER REFERENCES "public"."JobTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "seniority_id" INTEGER REFERENCES "public"."Seniority"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "technical_stacks_id" INTEGER REFERENCES "public"."TechnicalsStacks"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "sales_manager" VARCHAR(80),
    "search_manager" VARCHAR(80),
    "delivery_manager" VARCHAR(80),
    "administrative_area_level_1" VARCHAR(255),
    "leader" VARCHAR(150),
    "leader_mail" VARCHAR(150),
    "leader_phone" VARCHAR(50),
    "birth" DATE,
    "phone" VARCHAR(50),
    "email" VARCHAR(255),
    "address" TEXT,
    "sublocality" VARCHAR(255),
    "locality" VARCHAR(255),
    "country" VARCHAR(100),
    "nationality" VARCHAR(100),
    "afp_institution_id" INTEGER REFERENCES "public"."AFPInstitution"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "health_institution_id" INTEGER REFERENCES "public"."HealthInstitution"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "bank" VARCHAR(100),
    "account_number" VARCHAR(30),
    "salary_currency_type_id" INTEGER REFERENCES "public"."CurrencyType"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "net_salary" DECIMAL(12,2),
    "fee_currency_type_id" INTEGER REFERENCES "public"."CurrencyType"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "service_fee" DECIMAL(12,2),
    "fee" BOOLEAN,
    "billable_day" INTEGER,
    "laptop_currency_type_id" INTEGER REFERENCES "public"."CurrencyType"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "laptop_bonus" DECIMAL(12,2),
    "comment" VARCHAR(255),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."LeaveDays" (
    "id" SERIAL PRIMARY KEY,
    "person_id" INTEGER REFERENCES "public"."People"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "reason" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."PreInvoice" (
    "id" SERIAL PRIMARY KEY,
    "client_id" INTEGER REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "contact_id" INTEGER REFERENCES "public"."Contact"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "total" DECIMAL(12,2) DEFAULT 0,
    "status" VARCHAR(50) NOT NULL,
    "oc_number" VARCHAR(50),
    "hes_number" VARCHAR(50),
    "invoice_number" VARCHAR(50),
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "reject_note" TEXT,
    "oc_amount" DECIMAL(12,2),
    "edp_number" VARCHAR(50),
    "completed_by" VARCHAR(255),
    "completed_at" TIMESTAMP WITH TIME ZONE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."PreInvoiceDetail" (
    "id" SERIAL PRIMARY KEY,
    "pre_invoice_id" INTEGER REFERENCES "public"."PreInvoice"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "person_id" INTEGER REFERENCES "public"."People"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "status" VARCHAR(50) NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "currency_type" INTEGER REFERENCES "public"."CurrencyType"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "billable_days" DECIMAL(10,2) NOT NULL,
    "leave_days" DECIMAL(10,2) NOT NULL,
    "total_consume_days" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."Project" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "client_id" INTEGER REFERENCES "public"."Client"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    "start_date" DATE,
    "end_date" DATE,
    "status" VARCHAR(50),
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "public"."CurrencyHistory" (
    "id" SERIAL PRIMARY KEY,
    "date" DATE UNIQUE NOT NULL,
    "usd" NUMERIC NOT NULL,
    "uf" NUMERIC NOT NULL,
    "created_at" TIMESTAMP DEFAULT NOW(),
    "updated_at" TIMESTAMP DEFAULT NOW()
);

-- Insert data from backup files
-- AFPInstitution data
INSERT INTO "public"."AFPInstitution" ("id", "name", "created_at", "updated_at") VALUES 
('1', 'Habitat', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('2', 'Capital', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('3', 'Cuprum', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('4', 'Modelo', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('5', 'Plan Vital', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('6', 'Provida', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('7', 'Uno', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('8', 'No aplica', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662');

-- CurrencyType data
INSERT INTO "public"."CurrencyType" ("id", "name", "symbol", "created_at", "updated_at") VALUES 
('1', 'CLP', '$', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('2', 'USD', '$', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('3', 'UF', 'UF', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662');

-- Client data
INSERT INTO "public"."Client" ("id", "name", "created_at", "updated_at", "currency_type_id", "billable_day", "rut", "address", "company_name", "margin_percentage") VALUES 
('12', 'Falabella Tecnología', '2025-02-11 14:14:50.827646+00', '2025-02-11 14:14:50.827646', '3', '20', '77.261.280-K', 'Av. Presidente Riesco 5435, piso 10, Las Condes, Santiago', 'Falabella Tecnología SpA', 10.00), 
('13', 'Cencosud', '2025-02-11 14:15:14.019188+00', '2025-02-11 14:15:14.019188', '3', '30', '93.834.000-5', 'Av. Kennedy 9001, Las Condes, Santiago', 'Cencosud S.A.', 10.00), 
('14', 'Sonda', '2025-02-11 14:15:40.376192+00', '2025-02-11 14:15:40.376192', '1', '30', '83.628.100-4', 'Av. Providencia 1760, Providencia, Santiago', 'SONDA S.A.', 10.00), 
('15', 'BCI', '2025-02-11 14:16:01.130814+00', '2025-02-11 14:16:01.130814', '3', '30', '97.006.000-6', 'Av. El Golf 125, Las Condes, Santiago', 'Banco de Crédito e Inversiones', 10.00), 
('16', 'FID Seguros', '2025-02-11 14:16:27.886445+00', '2025-02-11 14:16:27.886445', '3', '30', '76.732.306-8', 'Av. Apoquindo 3600, piso 12, Las Condes, Santiago', 'FID Chile Seguros Generales S.A.', 10.00), 
('17', 'Sodimac', '2025-02-11 14:16:54.714902+00', '2025-02-11 14:16:54.714902', '3', '30', '96.792.430-K', 'Av. Presidente Eduardo Frei Montalva 3092, Renca, Santiago', 'Sodimac S.A.', 10.00), 
('18', 'Logística Internacional', '2025-02-11 14:17:18.652575+00', '2025-02-11 14:17:18.652575', '3', '30', '76.344.250-0', 'Av. Américo Vespucio Norte 1561, Vitacura, Santiago', 'Logística Internacional Chile S.A.', 10.00), 
('19', 'Falabella Financiero / Microsoft', '2025-02-11 14:17:51.578031+00', '2025-02-11 14:17:51.578031', '3', '30', '76.046.822-5', 'Av. Isidora Goyenechea 2800, Las Condes, Santiago', 'Falabella Financiero S.A.', 10.00), 
('20', 'Falabella Financiero', '2025-02-11 14:18:18.445523+00', '2025-02-11 14:18:18.445523', '3', '30', '76.046.822-5', 'Av. Isidora Goyenechea 2800, Las Condes, Santiago', 'Falabella Financiero S.A.', 10.00), 
('21', 'WOM', '2025-02-11 14:18:41.206556+00', '2025-02-11 14:18:41.206556', '3', '30', '78.921.690-8', 'Av. Apoquindo 4501, Las Condes, Santiago', 'WOM S.A.', 10.00), 
('22', 'IKEA', '2025-02-11 14:19:00.920972+00', '2025-02-11 14:19:00.920972', '3', '30', '77.176.958-K', 'Av. Presidente Riesco 5335, Las Condes, Santiago', 'IKEA Chile SpA', 10.00), 
('23', 'SMU', '2025-02-11 14:19:41.461263+00', '2025-02-11 14:19:41.461263', '3', '30', '76.012.676-4', 'Av. Cerro Colorado 5240, Las Condes, Santiago', 'SMU S.A.', 10.00), 
('24', 'Falabella Tecnología / Retail', '2025-02-11 14:20:13.393392+00', '2025-02-11 14:20:13.393392', '3', '30', '77.261.280-K', 'Av. Presidente Riesco 5435, piso 10, Las Condes, Santiago', 'Falabella Tecnología SpA', 10.00), 
('25', 'Banco Internacional', '2025-02-11 14:21:26.150416+00', '2025-02-11 14:21:26.150416', '3', '30', '97.011.000-3', 'Av. Apoquindo 6550, Las Condes, Santiago', 'Banco Internacional', 10.00), 
('26', 'ITAU', '2025-02-11 14:21:41.714317+00', '2025-02-11 14:21:41.714317', '3', '30', '76.645.030-K', 'Av. Apoquindo 3457, Las Condes, Santiago', 'Itaú Corpbanca', 10.00), 
('27', 'Ernest&Young', '2025-02-11 14:22:00.091132+00', '2025-02-11 14:22:00.091132', '3', '30', '77.802.430-6', 'Av. Isidora Goyenechea 2800, piso 2, Las Condes, Santiago', 'Ernst & Young Servicios Profesionales de Auditoría y Asesorías Limitada', 10.00), 
('28', 'Copec', '2025-02-11 14:22:21.829893+00', '2025-02-11 14:22:21.829893', '3', '30', '99.520.000-7', 'Av. Apoquindo 2929, Las Condes, Santiago', 'Compañía de Petróleos de Chile COPEC S.A.', 10.00), 
('29', 'Mall Plaza', '2025-02-11 14:22:38.68039+00', '2025-02-11 14:22:38.68039', '3', '30', '96.795.700-K', 'Av. Américo Vespucio Norte 1737, Huechuraba, Santiago', 'Plaza S.A.', 10.00);

-- HealthInstitution data
INSERT INTO "public"."HealthInstitution" ("id", "name", "created_at", "updated_at") VALUES 
('1', 'Fonasa', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('2', 'Banmédica', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('3', 'Consalud', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('4', 'Colmena', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('5', 'Cruz Blanca', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('6', 'Vida Tres', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('7', 'Nueva Masvida', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('8', 'Chuquicamata', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('9', 'No aplica', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662');

-- JobTitle data
INSERT INTO "public"."JobTitle" ("id", "name", "description" , "created_at", "updated_at") VALUES 
('1', 'Technical Lead', '', '2025-01-30 13:02:59.520274+00', '2025-01-30 13:02:59.520274'),
('2', 'Developer Back-End','', '2025-02-04 10:16:00.073251+00', '2025-02-04 10:16:00.073251'),
('3', 'Consultor de Procesos','', '2025-02-11 14:40:22.008901+00', '2025-02-11 14:40:22.008901'),
('4', 'Developer iOS','', '2025-02-11 14:40:41.574499+00', '2025-02-11 14:40:41.574499'),
('5', 'QA Analyst','', '2025-02-11 14:40:55.56335+00', '2025-02-11 14:40:55.56335'),
('6', 'Developer Android','', '2025-02-11 14:41:11.60849+00', '2025-02-11 14:41:11.60849'),
('7', 'Developer BI','', '2025-02-11 14:41:34.426977+00', '2025-02-11 14:41:34.426977'),
('8', 'Desarrollador de Integraciones Java','', '2025-02-11 14:41:52.078187+00', '2025-02-11 14:41:52.078187'),
('9', 'Data Engineer', '','2025-02-11 14:41:59.714455+00', '2025-02-11 14:41:59.714455'),
('10', 'Integrations Developer', '','2025-02-11 14:42:10.50858+00', '2025-02-11 14:42:10.50858'),
('11', 'Devops Engineer', '','2025-02-11 14:42:31.684725+00', '2025-02-11 14:42:31.684725'),
('12', 'Developer Mainframe', '','2025-02-11 14:42:50.512511+00', '2025-02-11 14:42:50.512511'),
('13', 'Product Owner', '','2025-02-11 14:43:53.953291+00', '2025-02-11 14:43:53.953291'),
('14', 'Data Analyst', '','2025-02-11 14:44:05.968848+00', '2025-02-11 14:44:05.968848'),
('15', 'Systems Architect', '','2025-02-11 14:44:19.176724+00', '2025-02-11 14:44:19.176724'),
('16', 'Project Manager', '','2025-02-11 14:44:36.048884+00', '2025-02-11 14:44:36.048884'),
('17', 'Developer Full-Stack', '','2025-02-11 14:44:47.3074+00', '2025-02-11 14:44:47.3074'),
('18', 'Cybersecurity Engineer', '','2025-02-11 14:45:26.79394+00', '2025-02-11 14:45:26.79394'),
('19', 'Analista QA', '', '2025-02-11 14:45:38.946012+00', '2025-02-11 14:45:38.946012'),
('20', 'Systems Analyst','', '2025-02-11 14:45:54.00676+00', '2025-02-11 14:45:54.00676'),
('21', 'UX UI Designer','', '2025-02-11 14:46:49.212309+00', '2025-02-11 14:46:49.212309'),
('22', 'Developer SQL','', '2025-02-11 14:47:02.177531+00', '2025-02-11 14:47:02.177531'),
('23', 'Developer Node JS','', '2025-02-11 14:47:14.578894+00', '2025-02-11 14:47:14.578894'),
('24', 'Developer Front-End','', '2025-02-11 14:47:33.898081+00', '2025-02-11 14:47:33.898081'),
('25', 'International Logistics Head','', '2025-02-11 14:49:00.723834+00', '2025-02-11 14:49:00.723834'),
('26', 'Developer','', '2025-02-11 14:50:36.472983+00', '2025-02-11 14:50:36.472983'),
('27', 'Lead Operations Analyst','', '2025-02-11 14:51:32.402177+00', '2025-02-11 14:51:32.402177'),
('28', 'Security Engineer SOC','', '2025-02-11 14:51:46.212814+00', '2025-02-11 14:51:46.212814'),
('29', 'Quality Engineer','', '2025-02-11 14:52:35.208264+00', '2025-02-11 14:52:35.208264'),
('30', 'Técnico de Soporte e Implementación','', '2025-02-11 14:52:56.163461+00', '2025-02-11 14:52:56.163461'),
('31', 'Especialista Base de datos','', '2025-02-11 14:53:11.458181+00', '2025-02-11 14:53:11.458181'),
('32', 'Platform Manager','', '2025-02-11 14:53:22.216951+00', '2025-02-11 14:53:22.216951'),
('33', 'Security Engineer','', '2025-02-11 14:53:33.603518+00', '2025-02-11 14:53:33.603518'),
('34', 'Desarrollador de Integraciones','', '2025-02-11 14:53:49.192199+00', '2025-02-11 14:53:49.192199'),
('35', 'Consultor Sap FICA','', '2025-02-11 14:54:14.342042+00', '2025-02-11 14:54:14.342042'),
('36', 'Engineerig Manager','', '2025-02-11 14:54:33.421607+00', '2025-02-11 14:54:33.421607'),
('37', 'Server Manager','', '2025-02-11 14:54:55.319+00', '2025-02-11 14:54:55.319'),
('38', 'Process Analyst','', '2025-02-11 14:55:14.499315+00', '2025-02-11 14:55:14.499315'),
('39', 'Analista Contable','', '2025-02-11 14:55:27.122885+00', '2025-02-11 14:55:27.122885'),
('40', 'Business Analyst','', '2025-02-11 14:55:41.317886+00', '2025-02-11 14:55:41.317886'),
('41', 'Campaign Analyst','', '2025-02-11 14:55:58.11292+00', '2025-02-11 14:55:58.11292'),
('42', 'Cloud Architect','', '2025-02-11 14:56:06.408708+00', '2025-02-11 14:56:06.408708'),
('43', 'Support Engineer','', '2025-02-11 14:56:22.675079+00', '2025-02-11 14:56:22.675079'),
('44', 'Analista de Recursos Humanos', '','2025-02-11 14:56:30.766533+00', '2025-02-11 14:56:30.766533');

-- Role data
INSERT INTO "public"."Role" ("id", "name", "created_at", "updated_at") VALUES 
('1', 'Administrador', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('2', 'Usuario', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('3', 'Supervisor', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662');

-- Seniority data
INSERT INTO "public"."Seniority" ("id", "name", "created_at", "updated_at") VALUES 
('1', 'Junior', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('2', 'Semi Senior', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('3', 'Senior', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662');

-- SkillLevel data
INSERT INTO "public"."SkillLevel" ("id", "name", "level", "created_at", "updated_at") VALUES 
('1', 'Desconocido', '0', '2025-02-04 00:00:00+00', '2025-02-04 00:00:00+00'),
('2', 'Principiante', '1', '2025-02-04 23:04:24.462202+00', '2025-02-04 00:00:00+00'),
('3', 'Intermedio', '2', '2025-02-04 23:04:54.480414+00', '2025-02-04 00:00:00+00'),
('4', 'Avanzado', '3', '2025-02-04 23:05:32.697025+00', '2025-02-04 23:05:32.697025+00'),
('5', 'Experto', '4', '2025-02-04 23:05:43.40887+00', '2025-02-04 23:05:43.40887+00');

-- TechnicalsStacks data
INSERT INTO "public"."TechnicalsStacks" ("id", "name", "created_at", "updated_at") VALUES 
('1', 'Java', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('2', 'Python', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('3', 'JavaScript', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('4', 'React', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('5', 'Node.js', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('6', 'SQL', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('7', 'MongoDB', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('8', 'AWS', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('9', 'Docker', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('10', 'Kubernetes', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662');

-- Price data
INSERT INTO "public"."Price" ("id", "name", "description", "value", "currency_type", "created_at", "updated_at") VALUES 
('1', 'Engineer Level 1', 'Ingeniero Junior', '1000000', '1', '2025-01-28 03:06:56.385889+00', '2025-01-28 03:06:56.385889'),
('2', 'Engineer Level 2', 'Ingeniero semi senior', '2000000', '1', '2025-01-28 03:07:27.875934+00', '2025-01-28 03:07:27.875934'),
('3', 'Engineer Level 3', 'Ingeniero Senior', '3000000', '1', '2025-01-28 03:08:08.983869+00', '2025-01-28 03:08:08.983869');

-- People data
INSERT INTO "public"."People" ("id", "name", "last_name", "dni", "corporate_name", "corporate_email", "contract_type", "contract_start", "contract_end", "contract_client_end", "role_id", "is_active", "causal", "reason", "client_id", "remote", "job_title_id", "seniority_id", "technical_stacks_id", "sales_manager", "search_manager", "delivery_manager", "administrative_area_level_1", "leader", "leader_mail", "leader_phone", "birth", "phone", "email", "address", "sublocality", "locality", "country", "nationality", "afp_institution_id", "health_institution_id", "bank", "account_number", "salary_currency_type_id", "net_salary", "fee_currency_type_id", "service_fee", "fee", "billable_day", "laptop_currency_type_id", "laptop_bonus", "comment", "created_at", "updated_at") VALUES 
-- Falabella Tecnología (client_id: 12)
(1, 'Juan', 'Pérez', '12345678-9', 'Falabella Tecnología', 'jperez@smartjob.cl', 'Contrato a Tiempo Completo', '2025-02-01', '2025-02-28', '2025-03-15', 1, true, 'Vacaciones', 'Vacaciones', 12, 'Remoto', 1, 1, 1, 'Gerente de Ventas', 'Gerente de Búsqueda', 'Gerente de Entrega', 'Región Metropolitana', 'Juan Pérez', 'jperez@falabella.com', '+56912345678', '1990-01-01', '+56912345678', 'juan.perez@gmail.com', 'Calle 1 #123', 'Santiago Centro', 'Santiago', 'Chile', 'Chilena', 1, 1, 'Banco de Chile', '123456789', 1, 1000000, 1, 500000, true, 8.0, 1, 500000, 'Comentario de Juan Pérez', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
(2, 'María', 'González', '87654321-0', 'Falabella Tecnología', 'mgonzalez@smartjob.cl', 'Contrato a Tiempo Completo', '2025-02-01', '2025-02-28', '2025-03-15', 2, true, 'Enfermedad', 'Enfermedad', 12, 'Remoto', 2, 2, 2, 'Gerente de Ventas', 'Gerente de Búsqueda', 'Gerente de Entrega', 'Región Metropolitana', 'María González', 'mgonzalez@falabella.com', '+56987654321', '1991-02-02', '+56987654321', 'maria.gonzalez@gmail.com', 'Calle 2 #456', 'Providencia', 'Santiago', 'Chile', 'Chilena', 2, 2, 'Banco de Estado', '234567890', 1, 1200000, 1, 600000, true, 8.0, 1, 600000, 'Comentario de María González', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
(3, 'Pedro', 'Rodríguez', '23456789-1', 'Falabella Tecnología', 'prodriguez@smartjob.cl', 'Contrato a Tiempo Completo', '2025-02-01', '2025-02-28', '2025-03-15', 3, true, 'Vacaciones', 'Vacaciones', 12, 'Remoto', 3, 3, 3, 'Gerente de Ventas', 'Gerente de Búsqueda', 'Gerente de Entrega', 'Región Metropolitana', 'Pedro Rodríguez', 'prodriguez@falabella.com', '+56923456789', '1992-03-03', '+56923456789', 'pedro.rodriguez@gmail.com', 'Calle 3 #789', 'Las Condes', 'Santiago', 'Chile', 'Chileno', 3, 3, 'Banco de Crédito e Inversiones', '345678901', 1, 1500000, 1, 750000, true, 8.0, 1, 750000, 'Comentario de Pedro Rodríguez', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),

-- Cencosud (client_id: 13)
(4, 'Ana', 'Martínez', '34567890-2', 'Cencosud', 'amartinez@smartjob.cl', 'Contrato a Tiempo Completo', '2025-02-01', '2025-02-28', '2025-03-15', 2, true, 'Vacaciones', 'Vacaciones', 13, 'Remoto', 4, 2, 4, 'Gerente de Ventas', 'Gerente de Búsqueda', 'Gerente de Entrega', 'Región Metropolitana', 'Ana Martínez', 'amartinez@cencosud.com', '+56934567890', '1993-04-04', '+56934567890', 'ana.martinez@gmail.com', 'Calle 4 #101', 'Las Condes', 'Santiago', 'Chile', 'Chilena', 4, 4, 'Banco de Chile', 456789012, 1, 1100000, 1, 550000, true, 8.0, 1, 550000, 'Comentario de Ana Martínez', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
(5, 'Carlos', 'López', '45678901-3', 'Cencosud', 'clopez@smartjob.cl', 'Contrato a Tiempo Completo', '2025-02-01', '2025-02-28', '2025-03-15', 2, true, 'Vacaciones', 'Vacaciones', 13, 'Remoto', 5, 2, 5, 'Gerente de Ventas', 'Gerente de Búsqueda', 'Gerente de Entrega', 'Región Metropolitana', 'Carlos López', 'clopez@cencosud.com', '+56945678901', '1994-05-05', '+56945678901', 'carlos.lopez@gmail.com', 'Calle 5 #202', 'Providencia', 'Santiago', 'Chile', 'Chileno', 5, 5, 'Banco de Chile', 567890123, 1, 1300000, 1, 650000, true, 8.0, 1, 650000, 'Comentario de Carlos López', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),

-- Sonda (client_id: 14)
(6, 'Laura', 'Sánchez', '56789012-4', 'SONDA', 'lsanchez@smartjob.cl', 'Contrato a Tiempo Completo', '2025-02-01', '2025-02-28', '2025-03-15', 2, true, 'Vacaciones', 'Vacaciones', 14, 'Remoto', 6, 2, 6, 'Gerente de Ventas', 'Gerente de Búsqueda', 'Gerente de Entrega', 'Región Metropolitana', 'Laura Sánchez', 'lsanchez@sonda.com', '+56956789012', '1995-06-06', '+56956789012', 'laura.sanchez@gmail.com', 'Calle 6 #303', 'Las Condes', 'Santiago', 'Chile', 'Chilena', 6, 6, 'Banco de Chile', 678901234, 1, 1400000, 1, 700000, true, 8.0, 1, 700000, 'Comentario de Laura Sánchez', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
(7, 'Roberto', 'García', '67890123-5', 'SONDA', 'rgarcia@smartjob.cl', 'Contrato a Tiempo Completo', '2025-02-01', '2025-02-28', '2025-03-15', 2, true, 'Enfermedad', 'Enfermedad', 14, 'Remoto', 7, 2, 7, 'Gerente de Ventas', 'Gerente de Búsqueda', 'Gerente de Entrega', 'Región Metropolitana', 'Roberto García', 'rgarcia@sonda.com', '+56967890123', '1996-07-07', '+56967890123', 'roberto.garcia@gmail.com', 'Calle 7 #404', 'Providencia', 'Santiago', 'Chile', 'Chileno', 7, 7, 'Banco de Chile', 789012345, 1, 1600000, 1, 800000, true, 8.0, 1, 800000, 'Comentario de Roberto García', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),

-- BCI (client_id: 15)
(8, 'Sofía', 'Fernández', '78901234-6', 'Banco de Crédito e Inversiones', 'sfernandez@smartjob.cl', 'Contrato a Tiempo Completo', '2025-02-01', '2025-02-28', '2025-03-15', 2, true, 'Vacaciones', 'Vacaciones', 15, 'Remoto', 8, 2, 8, 'Gerente de Ventas', 'Gerente de Búsqueda', 'Gerente de Entrega', 'Región Metropolitana', 'Sofía Fernández', 'sofia.fernandez@bci.cl', '+56978901234', '1997-08-08', '+56978901234', 'sofia.fernandez@gmail.com', 'Calle 8 #505', 'Las Condes', 'Santiago', 'Chile', 'Chilena', 8, 8, 'Banco de Chile', 890123456, 1, 1700000, 1, 850000, true, 8.0, 1, 850000, 'Comentario de Sofía Fernández', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
(9, 'Diego', 'Torres', '89012345-7', 'Banco de Crédito e Inversiones', 'dtorres@smartjob.cl', 'Contrato a Tiempo Completo', '2025-02-01', '2025-02-28', '2025-03-15', 2, true, 'Enfermedad', 'Enfermedad', 15, 'Remoto', 9, 2, 1, 'Gerente de Ventas', 'Gerente de Búsqueda', 'Gerente de Entrega', 'Región Metropolitana', 'Diego Torres', 'dtorres@bci.cl', '+56989012345', '1998-09-09', '+56989012345', 'diego.torres@gmail.com', 'Calle 9 #606', 'Providencia', 'Santiago', 'Chile', 'Chileno', 1, 1, 'Banco de Chile', 901234567, 1, 1800000, 1, 900000, true, 8, 1, 900000, 'Comentario de Diego Torres', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),

-- FID Seguros (client_id: 16)
(10, 'Valentina', 'Silva', '90123456-8', 'FID Chile Seguros Generales S.A.', 'vsilva@smartjob.cl', 'Contrato a Tiempo Completo', '2025-02-01', '2025-02-28', '2025-03-15', 2, true, 'Vacaciones', 'Vacaciones', 16, 'Remoto', 10, 2, 2, 'Gerente de Ventas', 'Gerente de Búsqueda', 'Gerente de Entrega', 'Región Metropolitana', 'Valentina Silva', 'vsilva@fidseguros.cl', '+56990123456', '1999-10-10', '+56990123456', 'valentina.silva@gmail.com', 'Calle 10 #707', 'Las Condes', 'Santiago', 'Chile', 'Chilena', 2, 2, 'Banco de Chile', 901234567, 1, 1900000, 1, 950000, true, 8.0, 1, 950000, 'Comentario de Valentina Silva', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
(11, 'Cosme', 'Fulanito', '01234567-9', 'FID Chile Seguros Generales S.A.', 'cfulanito@smartjob.cl', 'Contrato a Tiempo Completo', '2025-02-01', '2025-02-28', '2025-03-15', 2, true, 'Vacaciones', 'Vacaciones', 16, 'Remoto', 11, 2, 3, 'Gerente de Ventas', 'Gerente de Búsqueda', 'Gerente de Entrega', 'Región Metropolitana', 'Cosme Fulanito', 'cfulanito@fidseguros.cl', '+56901234567', '2000-11-11', '+56901234567', 'cosme.fulanito@gmail.com', 'Calle 11 #808', 'Providencia', 'Santiago', 'Chile', 'Chileno', 3, 3, 'Banco de Chile', 012345678, 1, 2000000, 1, 1000000, true, 8.0, 1, 1000000, 'Comentario de Cosme Fulanito', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662');

-- Holidays data
INSERT INTO "public"."Holidays" ("id", "date", "name", "created_at", "updated_at") VALUES 
('1', '2025-01-01', 'Año Nuevo', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('2', '2025-04-18', 'Viernes Santo', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('3', '2025-04-19', 'Sábado Santo', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('4', '2025-05-01', 'Día del Trabajo', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('5', '2025-05-21', 'Día de las Glorias Navales', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('6', '2025-06-29', 'San Pedro y San Pablo', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('7', '2025-07-16', 'Día de la Virgen del Carmen', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('8', '2025-08-15', 'Asunción de la Virgen', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('9', '2025-09-18', 'Fiestas Patrias', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('10', '2025-09-19', 'Día de las Glorias del Ejército', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('11', '2025-10-12', 'Encuentro de Dos Mundos', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('12', '2025-10-31', 'Día de las Iglesias Evangélicas y Protestantes', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('13', '2025-11-01', 'Día de Todos los Santos', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('14', '2025-12-08', 'Inmaculada Concepción', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('15', '2025-12-25', 'Navidad', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'); 

-- Contact data
INSERT INTO "public"."Contact" ("id", "name", "last_name", "email", "phone", "client_id", "created_at", "updated_at") VALUES 
('1', 'Juan', 'Pérez', 'juan.perez@bancodechile.cl', '+56912345678', '12', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('2', 'María', 'González', 'maria.gonzalez@bancoestado.cl', '+56987654321', '15', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('3', 'Pedro', 'Rodríguez', 'pedro.rodriguez@santander.cl', '+56923456789', '14', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('4', 'Ana', 'Martínez', 'ana.martinez@bci.cl', '+56934567890', '16', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('5', 'Carlos', 'López', 'carlos.lopez@security.cl', '+56945678901', '17', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('6', 'Laura', 'Sánchez', 'laura.sanchez@itau.cl', '+56956789012', '18', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('7', 'Roberto', 'García', 'roberto.garcia@scotiabank.cl', '+56967890123', '19', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('8', 'Sofía', 'Fernández', 'sofia.fernandez@falabella.cl', '+56978901234', '20', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('9', 'Diego', 'Torres', 'diego.torres@consorcio.cl', '+56989012345', '21', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('10', 'Valentina', 'Silva', 'valentina.silva@ripley.cl', '+56990123456', '22', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('11', 'Cosme', 'Fulanito', 'cosme@falabella.com', '+56930303030', '12', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('12', 'Andrés', 'Cortés', 'andres.cortes@cencosud.com', '+56911223344', '13', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('13', 'Patricia', 'Muñoz', 'patricia.munoz@sonda.com', '+56922334455', '14', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('14', 'Fernando', 'Rojas', 'fernando.rojas@bci.cl', '+56933445566', '15', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('15', 'Carolina', 'Vargas', 'carolina.vargas@fidseguros.cl', '+56944556677', '16', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('16', 'Ricardo', 'Mendoza', 'ricardo.mendoza@sodimac.com', '+56955667788', '17', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('17', 'Daniela', 'Pino', 'daniela.pino@logisticainternacional.cl', '+56966778899', '18', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('18', 'Javier', 'Silva', 'javier.silva@falabella.com', '+56977889900', '19', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('19', 'Camila', 'Torres', 'camila.torres@falabella.com', '+56988990011', '20', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('20', 'Felipe', 'Gómez', 'felipe.gomez@wom.cl', '+56999001122', '21', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('21', 'María José', 'Ríos', 'mariajose.rios@ikea.cl', '+56900112233', '22', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('22', 'Alejandro', 'Castro', 'alejandro.castro@smu.cl', '+56911223344', '23', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('23', 'Valeria', 'Herrera', 'valeria.herrera@falabella.com', '+56922334455', '24', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('24', 'Rodrigo', 'Navarro', 'rodrigo.navarro@bancointernacional.cl', '+56933445566', '25', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('25', 'Isabel', 'Mora', 'isabel.mora@itau.cl', '+56944556677', '26', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('26', 'Pablo', 'Fuentes', 'pablo.fuentes@ey.com', '+56955667788', '27', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('27', 'Natalia', 'Espinoza', 'natalia.espinoza@copec.cl', '+56966778899', '28', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('28', 'Gonzalo', 'Araya', 'gonzalo.araya@mallplaza.cl', '+56977889900', '29', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662');

-- PreInvoice data
INSERT INTO "public"."PreInvoice" ("id", "client_id", "contact_id", "total", "status", "oc_number", "hes_number", "invoice_number",
 "month", "year", "value", "reject_note", "oc_amount", "edp_number", "completed_by", "completed_at", 
 "created_at", "updated_at") VALUES 
-- Falabella Tecnología (client_id: 12)
(1, 12, 1, 2500000.00, 'DOWNLOADED', null, null, null, 3, 2023, 2500000.00, null, null, null, null, null, '2023-03-15 10:10:09.698662+00', '2023-03-15 10:10:09.698662'),
(2, 12, 1, 2800000.00, 'PENDING', null, null, null, 4, 2023, 2800000.00, null, null, null, null, null, '2023-04-10 11:15:09.698662+00', '2023-04-10 11:15:09.698662'),

-- Cencosud (client_id: 13)
(3, 13, 2, 3200000.00, 'COMPLETED', 'OC-003-2023', 'HES-003', 'INV-001-2023', 5, 2023, 3200000.00, null, 3200000.00, 'EDP-001', 'Jorge Acosta', '2023-05-25 14:30:00.000000+00', '2023-05-20 09:30:09.698662+00', '2023-05-25 14:30:00.000000+00'),
(4, 13, 2, 3500000.00, 'PENDING', null, null, null, 6, 2023, 3500000.00, null, null, null, null, null, '2023-06-05 14:20:09.698662+00', '2023-06-05 14:20:09.698662'),

-- Sonda (client_id: 14)
(5, 14, 3, 2800000.00, 'REJECTED',null, null, null, 7, 2023, 2800000.00, 'Missing documentation', null, null, null, null, '2023-07-12 16:45:09.698662+00', '2023-07-12 16:45:09.698662'),
(6, 14, 3, 3100000.00, 'DOWNLOADED', null, null, null, 8, 2023, 3100000.00, null, null, null, null, null, '2023-08-03 10:25:09.698662+00', '2023-08-03 10:25:09.698662'),

-- BCI (client_id: 15)
(7, 15, 4, 1900000.00, 'PENDING', null, null,null, 9, 2023, 1900000.00, null, null, null, null, null, '2023-09-18 13:40:09.698662+00', '2023-09-18 13:40:09.698662'),
(8, 15, 4, 2200000.00, 'COMPLETED', 'OC-008-2024', 'HES-008', 'INV-002-2023', 1, 2024, 2200000.00, null, 2200000.00, 'EDP-002', 'María González', '2024-01-28 11:45:00.000000+00', '2024-01-22 09:15:09.698662+00', '2024-01-28 11:45:00.000000+00'),

-- FID Seguros (client_id: 16)
(9, 16, 5, 3500000.00, 'PENDING', null, null, null, 2, 2024, 3500000.00, null, null, null, null, null, '2024-02-14 11:30:09.698662+00', '2024-02-14 11:30:09.698662'),
(10, 16, 5, 3800000.00, 'DOWNLOADED', null, null, null, 2, 2025, 3800000.00, null, null, null, null, null, '2025-02-27 14:21:25.008077+00', '2025-02-27 14:21:25.008077');

-- PreInvoiceDetail data
INSERT INTO "public"."PreInvoiceDetail" ("id", "pre_invoice_id", "person_id", "status", "value", "currency_type", "billable_days", "leave_days", "total_consume_days", "created_at", "updated_at") VALUES 
-- PreInvoice 1 (Falabella Tecnología, DOWNLOADED)
(1, 1, 1, 'ASSIGN', 120, 3, 20, 2, 22, '2023-03-15 10:15:09.698662+00', '2023-03-15 10:15:09.698662'),
(2, 1, 2, 'ASSIGN', 130, 3, 21, 0, 21, '2023-03-15 10:16:09.698662+00', '2023-03-15 10:16:09.698662'),

-- PreInvoice 2 (Falabella Tecnología, PENDING)
(3, 2, 1, 'ASSIGN', 140, 3, 22, 0, 22, '2023-04-10 11:20:09.698662+00', '2023-04-10 11:20:09.698662'),
(4, 2, 2, 'ASSIGN', 140, 3, 22, 0, 22, '2023-04-10 11:21:09.698662+00', '2023-04-10 11:21:09.698662'),

-- PreInvoice 3 (Cencosud, APPROVED)
(5, 3, 4, 'ASSIGN', 160, 3, 20, 2, 22, '2023-05-20 09:35:09.698662+00', '2023-05-20 09:35:09.698662'),
(6, 3, 5, 'ASSIGN', 160, 3, 20, 2, 22, '2023-05-20 09:36:09.698662+00', '2023-05-20 09:36:09.698662'),

-- PreInvoice 4 (Cencosud, PENDING)
(7, 4, 4, 'ASSIGN', 175, 3, 21, 1, 22, '2023-06-05 14:25:09.698662+00', '2023-06-05 14:25:09.698662'),
(8, 4, 5, 'ASSIGN', 175, 3, 21, 1, 22, '2023-06-05 14:26:09.698662+00', '2023-06-05 14:26:09.698662'),

-- PreInvoice 5 (Sonda, REJECTED)
(9, 5, 6, 'ASSIGN', 3400000.00, 1, 20, 0, 20, '2023-07-12 16:50:09.698662+00', '2023-07-12 16:50:09.698662'),
(10, 5, 7, 'ASSIGN', 3400000.00, 1, 20, 0, 20, '2023-07-12 16:51:09.698662+00', '2023-07-12 16:51:09.698662'),

-- PreInvoice 6 (Sonda, DOWNLOADED)
(11, 6, 6, 'ASSIGN', 155, 3, 22, 0, 22, '2023-08-03 10:30:09.698662+00', '2023-08-03 10:30:09.698662'),
(12, 6, 7, 'ASSIGN', 155, 3, 22, 0, 22, '2023-08-03 10:31:09.698662+00', '2023-08-03 10:31:09.698662'),

-- PreInvoice 7 (BCI, PENDING)
(13, 7, 8, 'ASSIGN', 130, 3, 19, 1, 20, '2023-09-18 13:45:09.698662+00', '2023-09-18 13:45:09.698662'),
(14, 7, 9, 'ASSIGN', 130, 3, 19, 1, 20, '2023-09-18 13:46:09.698662+00', '2023-09-18 13:46:09.698662'),

-- PreInvoice 8 (BCI, APPROVED)
(15, 8, 8, 'ASSIGN', 140, 3, 22, 0, 22, '2024-01-22 09:20:09.698662+00', '2024-01-22 09:20:09.698662'),
(16, 8, 9, 'ASSIGN', 130, 3, 22, 0, 22, '2024-01-22 09:21:09.698662+00', '2024-01-22 09:21:09.698662'),

-- PreInvoice 9 (FID Seguros, PENDING)
(17, 9, 10, 'ASSIGN', 125, 3, 20, 2, 22, '2024-02-14 11:35:09.698662+00', '2024-02-14 11:35:09.698662'),
(18, 9, 11, 'ASSIGN', 150, 3, 20, 2, 22, '2024-02-14 11:36:09.698662+00', '2024-02-14 11:36:09.698662'),

-- PreInvoice 10 (FID Seguros, DOWNLOADED)
(19, 10, 10, 'ASSIGN', 150, 3, 22, 0, 22, '2025-02-27 14:22:25.008077+00', '2025-02-27 14:22:25.008077'),
(20, 10, 11, 'ASSIGN', 110, 3, 22, 0, 22, '2025-02-27 14:23:25.008077+00', '2025-02-27 14:23:25.008077');

-- LeaveDays data
INSERT INTO "public"."LeaveDays" ("id", "person_id", "start_date", "end_date", "reason", "created_at", "updated_at") VALUES 
('1', '1', '2025-03-01', '2025-03-05', 'Vacaciones', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('2', '2', '2025-03-10', '2025-03-12', 'Enfermedad', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('3', '3', '2025-03-15', '2025-03-20', 'Vacaciones', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662');

INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-12-30',992.12,38414.22,'2025-05-08 17:39:23.98','2025-05-08 17:39:23.98'),
	 ('2024-12-27',990.95,38406.79,'2025-05-08 17:39:24.002','2025-05-08 17:39:24.002'),
	 ('2024-12-26',989.0700000000001,38404.32,'2025-05-08 17:39:24.004','2025-05-08 17:39:24.004'),
	 ('2024-12-24',992.78,38399.37,'2025-05-08 17:39:24.006','2025-05-08 17:39:24.006'),
	 ('2024-12-23',991.1799999999999,38396.89,'2025-05-08 17:39:24.008','2025-05-08 17:39:24.008'),
	 ('2024-12-20',996.35,38389.47,'2025-05-08 17:39:24.009','2025-05-08 17:39:24.009'),
	 ('2024-12-19',988.4400000000001,38386.99,'2025-05-08 17:39:24.01','2025-05-08 17:39:24.01'),
	 ('2024-12-18',990.87,38384.52,'2025-05-08 17:39:24.012','2025-05-08 17:39:24.012'),
	 ('2024-12-17',989.9299999999999,38382.05,'2025-05-08 17:39:24.014','2025-05-08 17:39:24.014'),
	 ('2024-12-16',983.25,38379.57,'2025-05-08 17:39:24.016','2025-05-08 17:39:24.016');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-12-13',975.67,38372.15,'2025-05-08 17:39:24.018','2025-05-08 17:39:24.018'),
	 ('2024-12-12',975.8099999999999,38369.68,'2025-05-08 17:39:24.019','2025-05-08 17:39:24.019'),
	 ('2024-12-11',972.4299999999999,38367.21,'2025-05-08 17:39:24.021','2025-05-08 17:39:24.021'),
	 ('2024-12-10',969.92,38364.73,'2025-05-08 17:39:24.022','2025-05-08 17:39:24.022'),
	 ('2024-12-09',971.62,38362.26,'2025-05-08 17:39:24.023','2025-05-08 17:39:24.023'),
	 ('2024-12-06',971.65,38324.11,'2025-05-08 17:39:24.025','2025-05-08 17:39:24.025'),
	 ('2024-12-05',974.37,38311.4,'2025-05-08 17:39:24.026','2025-05-08 17:39:24.026'),
	 ('2024-12-04',972.75,38298.7,'2025-05-08 17:39:24.027','2025-05-08 17:39:24.027'),
	 ('2024-12-03',979.1,38286,'2025-05-08 17:39:24.029','2025-05-08 17:39:24.029'),
	 ('2024-12-02',977.66,38273.3,'2025-05-08 17:39:24.03','2025-05-08 17:39:24.03');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-11-29',977.3200000000001,38235.24,'2025-05-08 17:39:24.031','2025-05-08 17:39:24.031'),
	 ('2024-11-28',975.41,38222.56,'2025-05-08 17:39:24.032','2025-05-08 17:39:24.032'),
	 ('2024-11-27',975.0599999999999,38209.88,'2025-05-08 17:39:24.033','2025-05-08 17:39:24.033'),
	 ('2024-11-26',976.89,38197.21,'2025-05-08 17:39:24.034','2025-05-08 17:39:24.034'),
	 ('2024-11-25',982.08,38184.54,'2025-05-08 17:39:24.035','2025-05-08 17:39:24.035'),
	 ('2024-11-22',971.29,38146.57,'2025-05-08 17:39:24.036','2025-05-08 17:39:24.036'),
	 ('2024-11-21',972.6799999999999,38133.92,'2025-05-08 17:39:24.037','2025-05-08 17:39:24.037'),
	 ('2024-11-20',973.21,38121.27,'2025-05-08 17:39:24.038','2025-05-08 17:39:24.038'),
	 ('2024-11-19',976.86,38108.63,'2025-05-08 17:39:24.039','2025-05-08 17:39:24.039'),
	 ('2024-11-18',974.51,38095.99,'2025-05-08 17:39:24.04','2025-05-08 17:39:24.04');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-11-15',975.4400000000001,38058.1,'2025-05-08 17:39:24.042','2025-05-08 17:39:24.042'),
	 ('2024-11-14',981.61,38045.48,'2025-05-08 17:39:24.043','2025-05-08 17:39:24.043'),
	 ('2024-11-13',983.76,38032.87,'2025-05-08 17:39:24.044','2025-05-08 17:39:24.044'),
	 ('2024-11-12',980.47,38020.25,'2025-05-08 17:39:24.045','2025-05-08 17:39:24.045'),
	 ('2024-11-11',963.09,38007.64,'2025-05-08 17:39:24.046','2025-05-08 17:39:24.046'),
	 ('2024-11-08',950.99,37981.22,'2025-05-08 17:39:24.047','2025-05-08 17:39:24.047'),
	 ('2024-11-07',968.6,37980,'2025-05-08 17:39:24.048','2025-05-08 17:39:24.048'),
	 ('2024-11-06',954.9,37978.77,'2025-05-08 17:39:24.049','2025-05-08 17:39:24.049'),
	 ('2024-11-05',956.54,37977.55,'2025-05-08 17:39:24.05','2025-05-08 17:39:24.05'),
	 ('2024-11-04',961.29,37976.32,'2025-05-08 17:39:24.051','2025-05-08 17:39:24.051');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-10-30',950.89,37970.2,'2025-05-08 17:39:24.052','2025-05-08 17:39:24.052'),
	 ('2024-10-29',945.88,37968.98,'2025-05-08 17:39:24.054','2025-05-08 17:39:24.054'),
	 ('2024-10-28',949.34,37967.75,'2025-05-08 17:39:24.055','2025-05-08 17:39:24.055'),
	 ('2024-10-25',945.29,37964.08,'2025-05-08 17:39:24.055','2025-05-08 17:39:24.055'),
	 ('2024-10-24',948.2,37962.86,'2025-05-08 17:39:24.056','2025-05-08 17:39:24.056'),
	 ('2024-10-23',949,37961.63,'2025-05-08 17:39:24.058','2025-05-08 17:39:24.058'),
	 ('2024-10-22',954.39,37960.41,'2025-05-08 17:39:24.059','2025-05-08 17:39:24.059'),
	 ('2024-10-21',946.99,37959.18,'2025-05-08 17:39:24.06','2025-05-08 17:39:24.06'),
	 ('2024-10-18',945.01,37955.51,'2025-05-08 17:39:24.06','2025-05-08 17:39:24.06'),
	 ('2024-10-17',941.3,37954.29,'2025-05-08 17:39:24.062','2025-05-08 17:39:24.062');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-10-16',937.29,37953.06,'2025-05-08 17:39:24.062','2025-05-08 17:39:24.062'),
	 ('2024-10-15',928.37,37951.84,'2025-05-08 17:39:24.063','2025-05-08 17:39:24.063'),
	 ('2024-10-14',926.0700000000001,37950.62,'2025-05-08 17:39:24.065','2025-05-08 17:39:24.065'),
	 ('2024-10-11',931.26,37946.95,'2025-05-08 17:39:24.066','2025-05-08 17:39:24.066'),
	 ('2024-10-10',934.84,37945.72,'2025-05-08 17:39:24.067','2025-05-08 17:39:24.067'),
	 ('2024-10-09',933.62,37944.5,'2025-05-08 17:39:24.068','2025-05-08 17:39:24.068'),
	 ('2024-10-08',925.86,37940.71,'2025-05-08 17:39:24.068','2025-05-08 17:39:24.068'),
	 ('2024-10-07',923.74,37936.93,'2025-05-08 17:39:24.069','2025-05-08 17:39:24.069'),
	 ('2024-10-04',919.49,37925.56,'2025-05-08 17:39:24.07','2025-05-08 17:39:24.07'),
	 ('2024-10-03',908.23,37921.78,'2025-05-08 17:39:24.071','2025-05-08 17:39:24.071');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-10-02',901.13,37917.99,'2025-05-08 17:39:24.072','2025-05-08 17:39:24.072'),
	 ('2024-10-01',897.6799999999999,37914.2,'2025-05-08 17:39:24.073','2025-05-08 17:39:24.073'),
	 ('2024-09-30',896.25,37910.42,'2025-05-08 17:39:24.074','2025-05-08 17:39:24.074'),
	 ('2024-09-27',900.91,37899.07,'2025-05-08 17:39:24.074','2025-05-08 17:39:24.074'),
	 ('2024-09-26',912.24,37895.28,'2025-05-08 17:39:24.075','2025-05-08 17:39:24.075'),
	 ('2024-09-25',911.51,37891.5,'2025-05-08 17:39:24.076','2025-05-08 17:39:24.076'),
	 ('2024-09-24',924.8099999999999,37887.71,'2025-05-08 17:39:24.077','2025-05-08 17:39:24.077'),
	 ('2024-09-23',927.15,37883.93,'2025-05-08 17:39:24.077','2025-05-08 17:39:24.077'),
	 ('2024-09-17',923.37,37861.24,'2025-05-08 17:39:24.078','2025-05-08 17:39:24.078'),
	 ('2024-09-16',925.61,37857.46,'2025-05-08 17:39:24.079','2025-05-08 17:39:24.079');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-09-13',933.5700000000001,37846.12,'2025-05-08 17:39:24.079','2025-05-08 17:39:24.079'),
	 ('2024-09-12',943.4400000000001,37842.34,'2025-05-08 17:39:24.08','2025-05-08 17:39:24.08'),
	 ('2024-09-11',948.85,37838.57,'2025-05-08 17:39:24.081','2025-05-08 17:39:24.081'),
	 ('2024-09-10',946.22,37834.79,'2025-05-08 17:39:24.082','2025-05-08 17:39:24.082'),
	 ('2024-09-09',943.1799999999999,37831.01,'2025-05-08 17:39:24.083','2025-05-08 17:39:24.083'),
	 ('2024-09-06',941.54,37805.48,'2025-05-08 17:39:24.083','2025-05-08 17:39:24.083'),
	 ('2024-09-05',937.86,37796.97,'2025-05-08 17:39:24.084','2025-05-08 17:39:24.084'),
	 ('2024-09-04',926.22,37788.47,'2025-05-08 17:39:24.085','2025-05-08 17:39:24.085'),
	 ('2024-09-03',915.14,37779.96,'2025-05-08 17:39:24.085','2025-05-08 17:39:24.085'),
	 ('2024-09-02',913.99,37771.46,'2025-05-08 17:39:24.086','2025-05-08 17:39:24.086');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-08-30',917.38,37745.97,'2025-05-08 17:39:24.087','2025-05-08 17:39:24.087'),
	 ('2024-08-29',912.08,37737.48,'2025-05-08 17:39:24.088','2025-05-08 17:39:24.088'),
	 ('2024-08-28',907.3200000000001,37728.99,'2025-05-08 17:39:24.088','2025-05-08 17:39:24.088'),
	 ('2024-08-27',907.35,37720.5,'2025-05-08 17:39:24.089','2025-05-08 17:39:24.089'),
	 ('2024-08-26',911.01,37712.02,'2025-05-08 17:39:24.09','2025-05-08 17:39:24.09'),
	 ('2024-08-23',919.9400000000001,37686.57,'2025-05-08 17:39:24.091','2025-05-08 17:39:24.091'),
	 ('2024-08-22',918.97,37678.09,'2025-05-08 17:39:24.092','2025-05-08 17:39:24.092'),
	 ('2024-08-21',922.58,37669.61,'2025-05-08 17:39:24.092','2025-05-08 17:39:24.092'),
	 ('2024-08-20',929.36,37661.13,'2025-05-08 17:39:24.093','2025-05-08 17:39:24.093'),
	 ('2024-08-19',933.84,37652.66,'2025-05-08 17:39:24.094','2025-05-08 17:39:24.094');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-08-16',931.39,37627.25,'2025-05-08 17:39:24.095','2025-05-08 17:39:24.095'),
	 ('2024-08-14',932.28,37610.32,'2025-05-08 17:39:24.095','2025-05-08 17:39:24.095'),
	 ('2024-08-13',931.96,37601.86,'2025-05-08 17:39:24.096','2025-05-08 17:39:24.096'),
	 ('2024-08-12',932.62,37593.4,'2025-05-08 17:39:24.097','2025-05-08 17:39:24.097'),
	 ('2024-08-09',937.1799999999999,37568.03,'2025-05-08 17:39:24.098','2025-05-08 17:39:24.098'),
	 ('2024-08-08',943.96,37569.25,'2025-05-08 17:39:24.099','2025-05-08 17:39:24.099'),
	 ('2024-08-07',947.1799999999999,37570.46,'2025-05-08 17:39:24.099','2025-05-08 17:39:24.099'),
	 ('2024-08-06',957.5700000000001,37571.67,'2025-05-08 17:39:24.1','2025-05-08 17:39:24.1'),
	 ('2024-08-05',951.11,37572.88,'2025-05-08 17:39:24.101','2025-05-08 17:39:24.101'),
	 ('2024-08-02',938.9400000000001,37576.52,'2025-05-08 17:39:24.102','2025-05-08 17:39:24.102');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-08-01',943.78,37577.74,'2025-05-08 17:39:24.103','2025-05-08 17:39:24.103'),
	 ('2024-07-31',956.58,37578.95,'2025-05-08 17:39:24.104','2025-05-08 17:39:24.104'),
	 ('2024-07-30',956.63,37580.16,'2025-05-08 17:39:24.104','2025-05-08 17:39:24.104'),
	 ('2024-07-29',950.29,37581.37,'2025-05-08 17:39:24.105','2025-05-08 17:39:24.105'),
	 ('2024-07-26',947.39,37585.01,'2025-05-08 17:39:24.107','2025-05-08 17:39:24.107'),
	 ('2024-07-25',948.79,37586.23,'2025-05-08 17:39:24.108','2025-05-08 17:39:24.108'),
	 ('2024-07-24',946.6900000000001,37587.44,'2025-05-08 17:39:24.109','2025-05-08 17:39:24.109'),
	 ('2024-07-23',949.1,37588.65,'2025-05-08 17:39:24.11','2025-05-08 17:39:24.11'),
	 ('2024-07-22',943.77,37589.87,'2025-05-08 17:39:24.111','2025-05-08 17:39:24.111'),
	 ('2024-07-19',940.15,37593.51,'2025-05-08 17:39:24.112','2025-05-08 17:39:24.112');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-07-18',921.91,37594.72,'2025-05-08 17:39:24.114','2025-05-08 17:39:24.114'),
	 ('2024-07-17',910.79,37595.93,'2025-05-08 17:39:24.115','2025-05-08 17:39:24.115'),
	 ('2024-07-15',910.14,37598.36,'2025-05-08 17:39:24.116','2025-05-08 17:39:24.116'),
	 ('2024-07-12',908.92,37602,'2025-05-08 17:39:24.117','2025-05-08 17:39:24.117'),
	 ('2024-07-11',918.86,37603.21,'2025-05-08 17:39:24.117','2025-05-08 17:39:24.117'),
	 ('2024-07-10',932.3099999999999,37604.43,'2025-05-08 17:39:24.118','2025-05-08 17:39:24.118'),
	 ('2024-07-09',939.17,37605.64,'2025-05-08 17:39:24.119','2025-05-08 17:39:24.119'),
	 ('2024-07-08',933.51,37601.88,'2025-05-08 17:39:24.12','2025-05-08 17:39:24.12'),
	 ('2024-07-05',936.55,37590.62,'2025-05-08 17:39:24.121','2025-05-08 17:39:24.121'),
	 ('2024-07-04',939.5700000000001,37586.87,'2025-05-08 17:39:24.122','2025-05-08 17:39:24.122');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-07-03',946.99,37583.12,'2025-05-08 17:39:24.123','2025-05-08 17:39:24.123'),
	 ('2024-07-02',943.89,37579.36,'2025-05-08 17:39:24.124','2025-05-08 17:39:24.124'),
	 ('2024-07-01',944.34,37575.61,'2025-05-08 17:39:24.126','2025-05-08 17:39:24.126'),
	 ('2024-06-28',951.02,37564.36,'2025-05-08 17:39:24.127','2025-05-08 17:39:24.127'),
	 ('2024-06-27',947.78,37560.61,'2025-05-08 17:39:24.128','2025-05-08 17:39:24.128'),
	 ('2024-06-26',942.3099999999999,37556.86,'2025-05-08 17:39:24.129','2025-05-08 17:39:24.129'),
	 ('2024-06-25',941.72,37553.11,'2025-05-08 17:39:24.13','2025-05-08 17:39:24.13'),
	 ('2024-06-24',937.34,37549.36,'2025-05-08 17:39:24.131','2025-05-08 17:39:24.131'),
	 ('2024-06-21',927.92,37538.11,'2025-05-08 17:39:24.132','2025-05-08 17:39:24.132'),
	 ('2024-06-19',934.91,37530.62,'2025-05-08 17:39:24.133','2025-05-08 17:39:24.133');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-06-18',938.6799999999999,37526.87,'2025-05-08 17:39:24.133','2025-05-08 17:39:24.133'),
	 ('2024-06-17',928.47,37523.12,'2025-05-08 17:39:24.134','2025-05-08 17:39:24.134'),
	 ('2024-06-14',919.49,37511.88,'2025-05-08 17:39:24.135','2025-05-08 17:39:24.135'),
	 ('2024-06-13',914.86,37508.14,'2025-05-08 17:39:24.135','2025-05-08 17:39:24.135'),
	 ('2024-06-12',924.1799999999999,37504.39,'2025-05-08 17:39:24.136','2025-05-08 17:39:24.136'),
	 ('2024-06-11',923.24,37500.65,'2025-05-08 17:39:24.137','2025-05-08 17:39:24.137'),
	 ('2024-06-10',916.84,37496.9,'2025-05-08 17:39:24.138','2025-05-08 17:39:24.138'),
	 ('2024-06-07',910.45,37481.1,'2025-05-08 17:39:24.139','2025-05-08 17:39:24.139'),
	 ('2024-06-06',906.25,37475.07,'2025-05-08 17:39:24.14','2025-05-08 17:39:24.14'),
	 ('2024-06-05',905.37,37469.04,'2025-05-08 17:39:24.141','2025-05-08 17:39:24.141');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-06-04',907.9400000000001,37463.01,'2025-05-08 17:39:24.142','2025-05-08 17:39:24.142'),
	 ('2024-06-03',916.77,37456.99,'2025-05-08 17:39:24.143','2025-05-08 17:39:24.143'),
	 ('2024-05-31',917.98,37438.91,'2025-05-08 17:39:24.144','2025-05-08 17:39:24.144'),
	 ('2024-05-30',907.67,37432.89,'2025-05-08 17:39:24.145','2025-05-08 17:39:24.145'),
	 ('2024-05-29',898.13,37426.87,'2025-05-08 17:39:24.146','2025-05-08 17:39:24.146'),
	 ('2024-05-28',900.28,37420.85,'2025-05-08 17:39:24.147','2025-05-08 17:39:24.147'),
	 ('2024-05-27',903.17,37414.83,'2025-05-08 17:39:24.148','2025-05-08 17:39:24.148'),
	 ('2024-05-24',908.95,37396.77,'2025-05-08 17:39:24.148','2025-05-08 17:39:24.148'),
	 ('2024-05-23',904.67,37390.76,'2025-05-08 17:39:24.15','2025-05-08 17:39:24.15'),
	 ('2024-05-22',886.79,37384.74,'2025-05-08 17:39:24.151','2025-05-08 17:39:24.151');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-05-20',897.11,37372.71,'2025-05-08 17:39:24.152','2025-05-08 17:39:24.152'),
	 ('2024-05-17',901.53,37354.68,'2025-05-08 17:39:24.153','2025-05-08 17:39:24.153'),
	 ('2024-05-16',909.0599999999999,37348.67,'2025-05-08 17:39:24.154','2025-05-08 17:39:24.154'),
	 ('2024-05-15',916.87,37342.66,'2025-05-08 17:39:24.154','2025-05-08 17:39:24.154'),
	 ('2024-05-14',922.1,37336.65,'2025-05-08 17:39:24.156','2025-05-08 17:39:24.156'),
	 ('2024-05-13',922,37330.65,'2025-05-08 17:39:24.157','2025-05-08 17:39:24.157'),
	 ('2024-05-10',930.99,37312.63,'2025-05-08 17:39:24.158','2025-05-08 17:39:24.158'),
	 ('2024-05-09',936.76,37306.63,'2025-05-08 17:39:24.159','2025-05-08 17:39:24.159'),
	 ('2024-05-08',934.29,37301.67,'2025-05-08 17:39:24.16','2025-05-08 17:39:24.16'),
	 ('2024-05-07',930.17,37296.7,'2025-05-08 17:39:24.161','2025-05-08 17:39:24.161');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-05-06',938.29,37291.74,'2025-05-08 17:39:24.162','2025-05-08 17:39:24.162'),
	 ('2024-05-03',954.36,37276.86,'2025-05-08 17:39:24.163','2025-05-08 17:39:24.163'),
	 ('2024-05-02',954.25,37271.9,'2025-05-08 17:39:24.164','2025-05-08 17:39:24.164'),
	 ('2024-04-30',943.62,37261.98,'2025-05-08 17:39:24.166','2025-05-08 17:39:24.166'),
	 ('2024-04-29',947.6799999999999,37257.02,'2025-05-08 17:39:24.167','2025-05-08 17:39:24.167'),
	 ('2024-04-26',948.61,37242.15,'2025-05-08 17:39:24.168','2025-05-08 17:39:24.168'),
	 ('2024-04-25',954.58,37237.2,'2025-05-08 17:39:24.169','2025-05-08 17:39:24.169'),
	 ('2024-04-24',950.77,37232.24,'2025-05-08 17:39:24.17','2025-05-08 17:39:24.17'),
	 ('2024-04-23',953.75,37227.29,'2025-05-08 17:39:24.172','2025-05-08 17:39:24.172'),
	 ('2024-04-22',956.3200000000001,37222.33,'2025-05-08 17:39:24.173','2025-05-08 17:39:24.173');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-04-19',968.4400000000001,37207.48,'2025-05-08 17:39:24.174','2025-05-08 17:39:24.174'),
	 ('2024-04-18',974.97,37202.53,'2025-05-08 17:39:24.175','2025-05-08 17:39:24.175'),
	 ('2024-04-17',985.05,37197.58,'2025-05-08 17:39:24.176','2025-05-08 17:39:24.176'),
	 ('2024-04-16',978.0700000000001,37192.63,'2025-05-08 17:39:24.177','2025-05-08 17:39:24.177'),
	 ('2024-04-15',964.59,37187.68,'2025-05-08 17:39:24.178','2025-05-08 17:39:24.178'),
	 ('2024-04-12',957.03,37172.84,'2025-05-08 17:39:24.179','2025-05-08 17:39:24.179'),
	 ('2024-04-11',953.51,37167.89,'2025-05-08 17:39:24.18','2025-05-08 17:39:24.18'),
	 ('2024-04-10',940.61,37162.94,'2025-05-08 17:39:24.181','2025-05-08 17:39:24.181'),
	 ('2024-04-09',946.71,37158,'2025-05-08 17:39:24.182','2025-05-08 17:39:24.182'),
	 ('2024-04-08',948.92,37150.83,'2025-05-08 17:39:24.183','2025-05-08 17:39:24.183');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-04-05',942.72,37129.33,'2025-05-08 17:39:24.184','2025-05-08 17:39:24.184'),
	 ('2024-04-04',962.83,37122.16,'2025-05-08 17:39:24.185','2025-05-08 17:39:24.185'),
	 ('2024-04-03',979.96,37115,'2025-05-08 17:39:24.186','2025-05-08 17:39:24.186'),
	 ('2024-04-02',982.59,37107.84,'2025-05-08 17:39:24.187','2025-05-08 17:39:24.187'),
	 ('2024-04-01',981.71,37100.68,'2025-05-08 17:39:24.188','2025-05-08 17:39:24.188'),
	 ('2024-03-28',982.38,37072.05,'2025-05-08 17:39:24.189','2025-05-08 17:39:24.189'),
	 ('2024-03-27',981.71,37064.9,'2025-05-08 17:39:24.19','2025-05-08 17:39:24.19'),
	 ('2024-03-26',977.76,37057.75,'2025-05-08 17:39:24.191','2025-05-08 17:39:24.191'),
	 ('2024-03-25',980.24,37050.6,'2025-05-08 17:39:24.192','2025-05-08 17:39:24.192'),
	 ('2024-03-22',971.54,37029.16,'2025-05-08 17:39:24.193','2025-05-08 17:39:24.193');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-03-21',975.91,37022.01,'2025-05-08 17:39:24.194','2025-05-08 17:39:24.194'),
	 ('2024-03-20',962.0599999999999,37014.87,'2025-05-08 17:39:24.196','2025-05-08 17:39:24.196'),
	 ('2024-03-19',945.11,37007.72,'2025-05-08 17:39:24.197','2025-05-08 17:39:24.197'),
	 ('2024-03-18',941.42,37000.58,'2025-05-08 17:39:24.198','2025-05-08 17:39:24.198'),
	 ('2024-03-15',945.5599999999999,36979.17,'2025-05-08 17:39:24.199','2025-05-08 17:39:24.199'),
	 ('2024-03-14',948.88,36972.04,'2025-05-08 17:39:24.2','2025-05-08 17:39:24.2'),
	 ('2024-03-13',965.1799999999999,36964.9,'2025-05-08 17:39:24.201','2025-05-08 17:39:24.201'),
	 ('2024-03-12',966.29,36957.77,'2025-05-08 17:39:24.202','2025-05-08 17:39:24.202'),
	 ('2024-03-11',964.95,36950.64,'2025-05-08 17:39:24.203','2025-05-08 17:39:24.203'),
	 ('2024-03-08',983.8,36927.49,'2025-05-08 17:39:24.204','2025-05-08 17:39:24.204');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-03-07',981.26,36918.61,'2025-05-08 17:39:24.205','2025-05-08 17:39:24.205'),
	 ('2024-03-06',976.36,36909.73,'2025-05-08 17:39:24.207','2025-05-08 17:39:24.207'),
	 ('2024-03-05',971.92,36900.86,'2025-05-08 17:39:24.208','2025-05-08 17:39:24.208'),
	 ('2024-03-04',966.41,36891.98,'2025-05-08 17:39:24.209','2025-05-08 17:39:24.209'),
	 ('2024-03-01',969.91,36865.37,'2025-05-08 17:39:24.21','2025-05-08 17:39:24.21'),
	 ('2024-02-29',980.1900000000001,36856.5,'2025-05-08 17:39:24.211','2025-05-08 17:39:24.211'),
	 ('2024-02-28',984.53,36847.64,'2025-05-08 17:39:24.212','2025-05-08 17:39:24.212'),
	 ('2024-02-27',986.85,36838.78,'2025-05-08 17:39:24.213','2025-05-08 17:39:24.213'),
	 ('2024-02-26',983.76,36829.92,'2025-05-08 17:39:24.214','2025-05-08 17:39:24.214'),
	 ('2024-02-23',972.77,36803.35,'2025-05-08 17:39:24.215','2025-05-08 17:39:24.215');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-02-22',967.52,36794.5,'2025-05-08 17:39:24.217','2025-05-08 17:39:24.217'),
	 ('2024-02-21',963.6799999999999,36785.65,'2025-05-08 17:39:24.218','2025-05-08 17:39:24.218'),
	 ('2024-02-20',966.23,36776.8,'2025-05-08 17:39:24.219','2025-05-08 17:39:24.219'),
	 ('2024-02-19',969.04,36767.95,'2025-05-08 17:39:24.22','2025-05-08 17:39:24.22'),
	 ('2024-02-16',961.9400000000001,36741.43,'2025-05-08 17:39:24.221','2025-05-08 17:39:24.221'),
	 ('2024-02-15',959.86,36732.6,'2025-05-08 17:39:24.222','2025-05-08 17:39:24.222'),
	 ('2024-02-14',971.5599999999999,36723.76,'2025-05-08 17:39:24.223','2025-05-08 17:39:24.223'),
	 ('2024-02-13',972.22,36714.93,'2025-05-08 17:39:24.224','2025-05-08 17:39:24.224'),
	 ('2024-02-12',968.73,36706.1,'2025-05-08 17:39:24.225','2025-05-08 17:39:24.225'),
	 ('2024-02-09',957.86,36679.62,'2025-05-08 17:39:24.226','2025-05-08 17:39:24.226');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-02-08',947.9,36685.55,'2025-05-08 17:39:24.227','2025-05-08 17:39:24.227'),
	 ('2024-02-07',949.8099999999999,36691.48,'2025-05-08 17:39:24.228','2025-05-08 17:39:24.228'),
	 ('2024-02-06',955.73,36697.42,'2025-05-08 17:39:24.229','2025-05-08 17:39:24.229'),
	 ('2024-02-05',943.84,36703.35,'2025-05-08 17:39:24.23','2025-05-08 17:39:24.23'),
	 ('2024-02-02',936.01,36721.16,'2025-05-08 17:39:24.231','2025-05-08 17:39:24.231'),
	 ('2024-02-01',932.26,36727.1,'2025-05-08 17:39:24.232','2025-05-08 17:39:24.232'),
	 ('2024-01-31',932.66,36733.04,'2025-05-08 17:39:24.234','2025-05-08 17:39:24.234'),
	 ('2024-01-30',927.63,36738.98,'2025-05-08 17:39:24.235','2025-05-08 17:39:24.235'),
	 ('2024-01-29',916.16,36744.92,'2025-05-08 17:39:24.236','2025-05-08 17:39:24.236'),
	 ('2024-01-26',910.97,36762.75,'2025-05-08 17:39:24.237','2025-05-08 17:39:24.237');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-01-25',908.51,36768.69,'2025-05-08 17:39:24.239','2025-05-08 17:39:24.239'),
	 ('2024-01-24',908.87,36774.64,'2025-05-08 17:39:24.24','2025-05-08 17:39:24.24'),
	 ('2024-01-23',905.63,36780.58,'2025-05-08 17:39:24.241','2025-05-08 17:39:24.241'),
	 ('2024-01-22',910.73,36786.53,'2025-05-08 17:39:24.242','2025-05-08 17:39:24.242'),
	 ('2024-01-19',918.62,36804.38,'2025-05-08 17:39:24.243','2025-05-08 17:39:24.243'),
	 ('2024-01-18',926.77,36810.33,'2025-05-08 17:39:24.244','2025-05-08 17:39:24.244'),
	 ('2024-01-17',922.0599999999999,36816.29,'2025-05-08 17:39:24.246','2025-05-08 17:39:24.246'),
	 ('2024-01-16',912.02,36822.24,'2025-05-08 17:39:24.247','2025-05-08 17:39:24.247'),
	 ('2024-01-15',908.67,36828.19,'2025-05-08 17:39:24.248','2025-05-08 17:39:24.248'),
	 ('2024-01-12',911.37,36846.06,'2025-05-08 17:39:24.249','2025-05-08 17:39:24.249');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2024-01-11',919.0700000000001,36852.02,'2025-05-08 17:39:24.251','2025-05-08 17:39:24.251'),
	 ('2024-01-10',914.71,36857.98,'2025-05-08 17:39:24.252','2025-05-08 17:39:24.252'),
	 ('2024-01-09',901.3099999999999,36863.94,'2025-05-08 17:39:24.253','2025-05-08 17:39:24.253'),
	 ('2024-01-08',893.0700000000001,36855.65,'2025-05-08 17:39:24.254','2025-05-08 17:39:24.254'),
	 ('2024-01-05',884.45,36830.78,'2025-05-08 17:39:24.255','2025-05-08 17:39:24.255'),
	 ('2024-01-04',884.39,36822.49,'2025-05-08 17:39:24.257','2025-05-08 17:39:24.257'),
	 ('2024-01-03',880.92,36814.21,'2025-05-08 17:39:24.258','2025-05-08 17:39:24.258'),
	 ('2024-01-02',877.12,36805.92,'2025-05-08 17:39:24.259','2025-05-08 17:39:24.259'),
	 ('2025-05-08',945.4400000000001,39127.41,'2025-05-08 17:39:24.26','2025-05-08 17:39:24.26'),
	 ('2025-05-07',939.67,39120.91,'2025-05-08 17:39:24.261','2025-05-08 17:39:24.261');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2025-05-06',940.1799999999999,39114.4,'2025-05-08 17:39:24.262','2025-05-08 17:39:24.262'),
	 ('2025-05-05',940.95,39107.9,'2025-05-08 17:39:24.264','2025-05-08 17:39:24.264'),
	 ('2025-05-02',955.67,39088.4,'2025-05-08 17:39:24.265','2025-05-08 17:39:24.265'),
	 ('2025-04-30',945.42,39075.41,'2025-05-08 17:39:24.267','2025-05-08 17:39:24.267'),
	 ('2025-04-29',937.54,39068.91,'2025-05-08 17:39:24.268','2025-05-08 17:39:24.268'),
	 ('2025-04-28',936.74,39062.41,'2025-05-08 17:39:24.269','2025-05-08 17:39:24.269'),
	 ('2025-04-25',937.8099999999999,39042.94,'2025-05-08 17:39:24.27','2025-05-08 17:39:24.27'),
	 ('2025-04-24',938.02,39036.45,'2025-05-08 17:39:24.272','2025-05-08 17:39:24.272'),
	 ('2025-04-23',950.04,39029.96,'2025-05-08 17:39:24.273','2025-05-08 17:39:24.273'),
	 ('2025-04-22',961.14,39023.47,'2025-05-08 17:39:24.274','2025-05-08 17:39:24.274');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2025-04-21',968.71,39016.98,'2025-05-08 17:39:24.276','2025-05-08 17:39:24.276'),
	 ('2025-04-17',969.23,38991.04,'2025-05-08 17:39:24.277','2025-05-08 17:39:24.277'),
	 ('2025-04-16',967.15,38984.56,'2025-05-08 17:39:24.279','2025-05-08 17:39:24.279'),
	 ('2025-04-15',966.0700000000001,38978.08,'2025-05-08 17:39:24.28','2025-05-08 17:39:24.28'),
	 ('2025-04-14',978.09,38971.6,'2025-05-08 17:39:24.281','2025-05-08 17:39:24.281'),
	 ('2025-04-11',988.97,38952.17,'2025-05-08 17:39:24.282','2025-05-08 17:39:24.282'),
	 ('2025-04-10',1000.01,38945.69,'2025-05-08 17:39:24.284','2025-05-08 17:39:24.284'),
	 ('2025-04-09',993.89,38939.22,'2025-05-08 17:39:24.285','2025-05-08 17:39:24.285'),
	 ('2025-04-08',990.6799999999999,38934.2,'2025-05-08 17:39:24.286','2025-05-08 17:39:24.286'),
	 ('2025-04-07',975.8200000000001,38929.19,'2025-05-08 17:39:24.288','2025-05-08 17:39:24.288');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2025-04-04',946.59,38914.15,'2025-05-08 17:39:24.289','2025-05-08 17:39:24.289'),
	 ('2025-04-03',949.83,38909.14,'2025-05-08 17:39:24.29','2025-05-08 17:39:24.29'),
	 ('2025-04-02',946.28,38904.13,'2025-05-08 17:39:24.292','2025-05-08 17:39:24.292'),
	 ('2025-04-01',953.0700000000001,38899.12,'2025-05-08 17:39:24.293','2025-05-08 17:39:24.293'),
	 ('2025-03-31',946.1,38894.11,'2025-05-08 17:39:24.294','2025-05-08 17:39:24.294'),
	 ('2025-03-28',931.75,38879.09,'2025-05-08 17:39:24.296','2025-05-08 17:39:24.296'),
	 ('2025-03-27',920.98,38874.08,'2025-05-08 17:39:24.297','2025-05-08 17:39:24.297'),
	 ('2025-03-26',919.92,38869.08,'2025-05-08 17:39:24.299','2025-05-08 17:39:24.299'),
	 ('2025-03-25',926.41,38864.07,'2025-05-08 17:39:24.3','2025-05-08 17:39:24.3'),
	 ('2025-03-24',932.14,38859.07,'2025-05-08 17:39:24.302','2025-05-08 17:39:24.302');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2025-03-21',926.15,38844.06,'2025-05-08 17:39:24.303','2025-05-08 17:39:24.303'),
	 ('2025-03-20',917.76,38839.06,'2025-05-08 17:39:24.304','2025-05-08 17:39:24.304'),
	 ('2025-03-19',917.97,38834.06,'2025-05-08 17:39:24.306','2025-05-08 17:39:24.306'),
	 ('2025-03-18',923.3200000000001,38829.06,'2025-05-08 17:39:24.307','2025-05-08 17:39:24.307'),
	 ('2025-03-17',932.36,38824.06,'2025-05-08 17:39:24.308','2025-05-08 17:39:24.308'),
	 ('2025-03-14',940.2,38809.06,'2025-05-08 17:39:24.31','2025-05-08 17:39:24.31'),
	 ('2025-03-13',932.28,38804.06,'2025-05-08 17:39:24.311','2025-05-08 17:39:24.311'),
	 ('2025-03-12',937.45,38799.07,'2025-05-08 17:39:24.312','2025-05-08 17:39:24.312'),
	 ('2025-03-11',931.13,38794.07,'2025-05-08 17:39:24.314','2025-05-08 17:39:24.314'),
	 ('2025-03-10',928.25,38789.07,'2025-05-08 17:39:24.315','2025-05-08 17:39:24.315');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2025-03-07',926.52,38753.79,'2025-05-08 17:39:24.316','2025-05-08 17:39:24.316'),
	 ('2025-03-06',936.7,38738.65,'2025-05-08 17:39:24.317','2025-05-08 17:39:24.317'),
	 ('2025-03-05',948.87,38723.52,'2025-05-08 17:39:24.319','2025-05-08 17:39:24.319'),
	 ('2025-03-04',953.11,38708.39,'2025-05-08 17:39:24.32','2025-05-08 17:39:24.32'),
	 ('2025-03-03',954.22,38693.27,'2025-05-08 17:39:24.321','2025-05-08 17:39:24.321'),
	 ('2025-02-28',951.21,38647.94,'2025-05-08 17:39:24.323','2025-05-08 17:39:24.323'),
	 ('2025-02-27',941.76,38632.84,'2025-05-08 17:39:24.324','2025-05-08 17:39:24.324'),
	 ('2025-02-26',940.99,38617.75,'2025-05-08 17:39:24.325','2025-05-08 17:39:24.325'),
	 ('2025-02-25',946.96,38602.67,'2025-05-08 17:39:24.326','2025-05-08 17:39:24.326'),
	 ('2025-02-24',942.52,38587.59,'2025-05-08 17:39:24.328','2025-05-08 17:39:24.328');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2025-02-21',944.65,38542.38,'2025-05-08 17:39:24.329','2025-05-08 17:39:24.329'),
	 ('2025-02-20',951.78,38527.33,'2025-05-08 17:39:24.33','2025-05-08 17:39:24.33'),
	 ('2025-02-19',950.4299999999999,38512.28,'2025-05-08 17:39:24.331','2025-05-08 17:39:24.331'),
	 ('2025-02-18',947.13,38497.23,'2025-05-08 17:39:24.333','2025-05-08 17:39:24.333'),
	 ('2025-02-17',939.54,38482.2,'2025-05-08 17:39:24.334','2025-05-08 17:39:24.334'),
	 ('2025-02-14',949.52,38437.12,'2025-05-08 17:39:24.335','2025-05-08 17:39:24.335'),
	 ('2025-02-13',956.63,38422.1,'2025-05-08 17:39:24.336','2025-05-08 17:39:24.336'),
	 ('2025-02-12',961.89,38407.09,'2025-05-08 17:39:24.337','2025-05-08 17:39:24.337'),
	 ('2025-02-11',960.8099999999999,38392.09,'2025-05-08 17:39:24.338','2025-05-08 17:39:24.338'),
	 ('2025-02-10',960.6,38377.09,'2025-05-08 17:39:24.339','2025-05-08 17:39:24.339');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2025-02-07',967.59,38367.06,'2025-05-08 17:39:24.34','2025-05-08 17:39:24.34'),
	 ('2025-02-06',969.47,38369.54,'2025-05-08 17:39:24.341','2025-05-08 17:39:24.341'),
	 ('2025-02-05',977.58,38372.01,'2025-05-08 17:39:24.342','2025-05-08 17:39:24.342'),
	 ('2025-02-04',987.12,38374.49,'2025-05-08 17:39:24.345','2025-05-08 17:39:24.345'),
	 ('2025-02-03',984.22,38376.97,'2025-05-08 17:39:24.346','2025-05-08 17:39:24.346'),
	 ('2025-01-31',988.1,38384.41,'2025-05-08 17:39:24.348','2025-05-08 17:39:24.348'),
	 ('2025-01-30',990.9400000000001,38386.88,'2025-05-08 17:39:24.349','2025-05-08 17:39:24.349'),
	 ('2025-01-29',992.0700000000001,38389.36,'2025-05-08 17:39:24.35','2025-05-08 17:39:24.35'),
	 ('2025-01-28',985.64,38391.84,'2025-05-08 17:39:24.351','2025-05-08 17:39:24.351'),
	 ('2025-01-27',982.95,38394.32,'2025-05-08 17:39:24.352','2025-05-08 17:39:24.352');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2025-01-24',989.83,38401.76,'2025-05-08 17:39:24.353','2025-05-08 17:39:24.353'),
	 ('2025-01-23',995.22,38404.24,'2025-05-08 17:39:24.355','2025-05-08 17:39:24.355'),
	 ('2025-01-22',1002.14,38406.72,'2025-05-08 17:39:24.356','2025-05-08 17:39:24.356'),
	 ('2025-01-21',1001.93,38409.2,'2025-05-08 17:39:24.357','2025-05-08 17:39:24.357'),
	 ('2025-01-20',1012.36,38411.68,'2025-05-08 17:39:24.358','2025-05-08 17:39:24.358'),
	 ('2025-01-17',1010.68,38419.13,'2025-05-08 17:39:24.359','2025-05-08 17:39:24.359'),
	 ('2025-01-16',1001.93,38421.61,'2025-05-08 17:39:24.361','2025-05-08 17:39:24.361'),
	 ('2025-01-15',1004.67,38424.09,'2025-05-08 17:39:24.363','2025-05-08 17:39:24.363'),
	 ('2025-01-14',1012.76,38426.57,'2025-05-08 17:39:24.364','2025-05-08 17:39:24.364'),
	 ('2025-01-13',1009.2,38429.05,'2025-05-08 17:39:24.365','2025-05-08 17:39:24.365');
INSERT INTO public."CurrencyHistory" ("date","usd","uf","created_at","updated_at") VALUES
	 ('2025-01-10',1003.92,38436.5,'2025-05-08 17:39:24.366','2025-05-08 17:39:24.366'),
	 ('2025-01-09',1007.51,38438.98,'2025-05-08 17:39:24.368','2025-05-08 17:39:24.368'),
	 ('2025-01-08',1005.85,38436.51,'2025-05-08 17:39:24.369','2025-05-08 17:39:24.369'),
	 ('2025-01-07',1010.98,38434.03,'2025-05-08 17:39:24.371','2025-05-08 17:39:24.371'),
	 ('2025-01-06',1011.82,38431.55,'2025-05-08 17:39:24.372','2025-05-08 17:39:24.372'),
	 ('2025-01-03',999.84,38424.12,'2025-05-08 17:39:24.373','2025-05-08 17:39:24.373'),
	 ('2025-01-02',996.46,38421.65,'2025-05-08 17:39:24.375','2025-05-08 17:39:24.375');


SELECT setval(pg_get_serial_sequence('"People"', 'id'), (SELECT MAX(id) FROM "People"));
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
    "name" VARCHAR(255) NOT NULL,
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
('5', 'PlanVital', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('6', 'Provida', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('7', 'Uno', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('8', 'No aplica', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662');

-- CurrencyType data
INSERT INTO "public"."CurrencyType" ("id", "name", "symbol", "created_at", "updated_at") VALUES 
('1', 'Peso Chileno', '$', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('2', 'Dolar', '$', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('3', 'UF', 'UF', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662');

-- Client data
INSERT INTO "public"."Client" ("id", "name", "created_at", "updated_at", "currency_type_id", "billable_day", "rut", "address", "company_name", "margin_percentage") VALUES 
('12', 'Falabella Tecnología', '2025-02-11 14:14:50.827646+00', '2025-02-11 14:14:50.827646', '1', '20', '77.261.280-K', 'Av. Presidente Riesco 5435, piso 10, Las Condes, Santiago', 'Falabella Tecnología SpA', 10.00), 
('13', 'Cencosud', '2025-02-11 14:15:14.019188+00', '2025-02-11 14:15:14.019188', '1', '30', '93.834.000-5', 'Av. Kennedy 9001, Las Condes, Santiago', 'Cencosud S.A.', 10.00), 
('14', 'Sonda', '2025-02-11 14:15:40.376192+00', '2025-02-11 14:15:40.376192', '1', '30', '83.628.100-4', 'Av. Providencia 1760, Providencia, Santiago', 'SONDA S.A.', 10.00), 
('15', 'BCI', '2025-02-11 14:16:01.130814+00', '2025-02-11 14:16:01.130814', '1', '30', '97.006.000-6', 'Av. El Golf 125, Las Condes, Santiago', 'Banco de Crédito e Inversiones', 10.00), 
('16', 'FID Seguros', '2025-02-11 14:16:27.886445+00', '2025-02-11 14:16:27.886445', '1', '30', '76.732.306-8', 'Av. Apoquindo 3600, piso 12, Las Condes, Santiago', 'FID Chile Seguros Generales S.A.', 10.00), 
('17', 'Sodimac', '2025-02-11 14:16:54.714902+00', '2025-02-11 14:16:54.714902', '1', '30', '96.792.430-K', 'Av. Presidente Eduardo Frei Montalva 3092, Renca, Santiago', 'Sodimac S.A.', 10.00), 
('18', 'Logística Internacional', '2025-02-11 14:17:18.652575+00', '2025-02-11 14:17:18.652575', '1', '30', '76.344.250-0', 'Av. Américo Vespucio Norte 1561, Vitacura, Santiago', 'Logística Internacional Chile S.A.', 10.00), 
('19', 'Falabella Financiero / Microsoft', '2025-02-11 14:17:51.578031+00', '2025-02-11 14:17:51.578031', '1', '30', '76.046.822-5', 'Av. Isidora Goyenechea 2800, Las Condes, Santiago', 'Falabella Financiero S.A.', 10.00), 
('20', 'Falabella Financiero', '2025-02-11 14:18:18.445523+00', '2025-02-11 14:18:18.445523', '1', '30', '76.046.822-5', 'Av. Isidora Goyenechea 2800, Las Condes, Santiago', 'Falabella Financiero S.A.', 10.00), 
('21', 'WOM', '2025-02-11 14:18:41.206556+00', '2025-02-11 14:18:41.206556', '1', '30', '78.921.690-8', 'Av. Apoquindo 4501, Las Condes, Santiago', 'WOM S.A.', 10.00), 
('22', 'IKEA', '2025-02-11 14:19:00.920972+00', '2025-02-11 14:19:00.920972', '1', '30', '77.176.958-K', 'Av. Presidente Riesco 5335, Las Condes, Santiago', 'IKEA Chile SpA', 10.00), 
('23', 'SMU', '2025-02-11 14:19:41.461263+00', '2025-02-11 14:19:41.461263', '1', '30', '76.012.676-4', 'Av. Cerro Colorado 5240, Las Condes, Santiago', 'SMU S.A.', 10.00), 
('24', 'Falabella Tecnología / Retail', '2025-02-11 14:20:13.393392+00', '2025-02-11 14:20:13.393392', '1', '30', '77.261.280-K', 'Av. Presidente Riesco 5435, piso 10, Las Condes, Santiago', 'Falabella Tecnología SpA', 10.00), 
('25', 'Banco Internacional', '2025-02-11 14:21:26.150416+00', '2025-02-11 14:21:26.150416', '1', '30', '97.011.000-3', 'Av. Apoquindo 6550, Las Condes, Santiago', 'Banco Internacional', 10.00), 
('26', 'ITAU', '2025-02-11 14:21:41.714317+00', '2025-02-11 14:21:41.714317', '1', '30', '76.645.030-K', 'Av. Apoquindo 3457, Las Condes, Santiago', 'Itaú Corpbanca', 10.00), 
('27', 'Ernest&Young', '2025-02-11 14:22:00.091132+00', '2025-02-11 14:22:00.091132', '1', '30', '77.802.430-6', 'Av. Isidora Goyenechea 2800, piso 2, Las Condes, Santiago', 'Ernst & Young Servicios Profesionales de Auditoría y Asesorías Limitada', 10.00), 
('28', 'Copec', '2025-02-11 14:22:21.829893+00', '2025-02-11 14:22:21.829893', '1', '30', '99.520.000-7', 'Av. Apoquindo 2929, Las Condes, Santiago', 'Compañía de Petróleos de Chile COPEC S.A.', 10.00), 
('29', 'Mall Plaza', '2025-02-11 14:22:38.68039+00', '2025-02-11 14:22:38.68039', '1', '30', '96.795.700-K', 'Av. Américo Vespucio Norte 1737, Huechuraba, Santiago', 'Plaza S.A.', 10.00);

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
(1, 1, 1, 'ASSIGN', 1200000.00, 1, 20, 2, 22, '2023-03-15 10:15:09.698662+00', '2023-03-15 10:15:09.698662'),
(2, 1, 2, 'ASSIGN', 1300000.00, 1, 21, 0, 21, '2023-03-15 10:16:09.698662+00', '2023-03-15 10:16:09.698662'),

-- PreInvoice 2 (Falabella Tecnología, PENDING)
(3, 2, 1, 'ASSIGN', 1400000.00, 1, 22, 0, 22, '2023-04-10 11:20:09.698662+00', '2023-04-10 11:20:09.698662'),
(4, 2, 2, 'ASSIGN', 1400000.00, 1, 22, 0, 22, '2023-04-10 11:21:09.698662+00', '2023-04-10 11:21:09.698662'),

-- PreInvoice 3 (Cencosud, APPROVED)
(5, 3, 4, 'ASSIGN', 1600000.00, 1, 20, 2, 22, '2023-05-20 09:35:09.698662+00', '2023-05-20 09:35:09.698662'),
(6, 3, 5, 'ASSIGN', 1600000.00, 1, 20, 2, 22, '2023-05-20 09:36:09.698662+00', '2023-05-20 09:36:09.698662'),

-- PreInvoice 4 (Cencosud, PENDING)
(7, 4, 4, 'ASSIGN', 1750000.00, 1, 21, 1, 22, '2023-06-05 14:25:09.698662+00', '2023-06-05 14:25:09.698662'),
(8, 4, 5, 'ASSIGN', 1750000.00, 1, 21, 1, 22, '2023-06-05 14:26:09.698662+00', '2023-06-05 14:26:09.698662'),

-- PreInvoice 5 (Sonda, REJECTED)
(9, 5, 6, 'ASSIGN', 1400000.00, 1, 20, 0, 20, '2023-07-12 16:50:09.698662+00', '2023-07-12 16:50:09.698662'),
(10, 5, 7, 'ASSIGN', 1400000.00, 1, 20, 0, 20, '2023-07-12 16:51:09.698662+00', '2023-07-12 16:51:09.698662'),

-- PreInvoice 6 (Sonda, DOWNLOADED)
(11, 6, 6, 'ASSIGN', 1550000.00, 1, 22, 0, 22, '2023-08-03 10:30:09.698662+00', '2023-08-03 10:30:09.698662'),
(12, 6, 7, 'ASSIGN', 1550000.00, 1, 22, 0, 22, '2023-08-03 10:31:09.698662+00', '2023-08-03 10:31:09.698662'),

-- PreInvoice 7 (BCI, PENDING)
(13, 7, 8, 'ASSIGN', 950000.00, 1, 19, 1, 20, '2023-09-18 13:45:09.698662+00', '2023-09-18 13:45:09.698662'),
(14, 7, 9, 'ASSIGN', 950000.00, 1, 19, 1, 20, '2023-09-18 13:46:09.698662+00', '2023-09-18 13:46:09.698662'),

-- PreInvoice 8 (BCI, APPROVED)
(15, 8, 8, 'ASSIGN', 1100000.00, 1, 22, 0, 22, '2024-01-22 09:20:09.698662+00', '2024-01-22 09:20:09.698662'),
(16, 8, 9, 'ASSIGN', 1100000.00, 1, 22, 0, 22, '2024-01-22 09:21:09.698662+00', '2024-01-22 09:21:09.698662'),

-- PreInvoice 9 (FID Seguros, PENDING)
(17, 9, 10, 'ASSIGN', 1750000.00, 1, 20, 2, 22, '2024-02-14 11:35:09.698662+00', '2024-02-14 11:35:09.698662'),
(18, 9, 11, 'ASSIGN', 1750000.00, 1, 20, 2, 22, '2024-02-14 11:36:09.698662+00', '2024-02-14 11:36:09.698662'),

-- PreInvoice 10 (FID Seguros, DOWNLOADED)
(19, 10, 10, 'ASSIGN', 1900000.00, 1, 22, 0, 22, '2025-02-27 14:22:25.008077+00', '2025-02-27 14:22:25.008077'),
(20, 10, 11, 'ASSIGN', 1900000.00, 1, 22, 0, 22, '2025-02-27 14:23:25.008077+00', '2025-02-27 14:23:25.008077');

-- LeaveDays data
INSERT INTO "public"."LeaveDays" ("id", "person_id", "start_date", "end_date", "reason", "created_at", "updated_at") VALUES 
('1', '1', '2025-03-01', '2025-03-05', 'Vacaciones', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('2', '2', '2025-03-10', '2025-03-12', 'Enfermedad', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('3', '3', '2025-03-15', '2025-03-20', 'Vacaciones', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662');


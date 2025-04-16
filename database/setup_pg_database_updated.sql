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
    "email" VARCHAR(255),
    "corporate_email" VARCHAR(255),
    "role_id" INTEGER REFERENCES "public"."Role"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "dni" VARCHAR(50),
    "address" TEXT,
    "sublocality" VARCHAR(255),
    "locality" VARCHAR(255),
    "administrative_area_level_1" VARCHAR(255),
        "country" VARCHAR(100),
    "nationality" VARCHAR(100),
    "afp_institution_id" INTEGER REFERENCES "public"."AFPInstitution"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "health_institution_id" INTEGER REFERENCES "public"."HealthInstitution"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "seniority_id" INTEGER REFERENCES "public"."Seniority"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "net_salary" DECIMAL(12,2),
    "currency_type_id" INTEGER REFERENCES "public"."CurrencyType"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "job_title_id" INTEGER REFERENCES "public"."JobTitle"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "fee" DECIMAL(12,2),
    "birth" DATE,
    "client_id" INTEGER REFERENCES "public"."Client"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    "phone" VARCHAR(50),
    "billable_day" DECIMAL(10,2) DEFAULT 8.0,
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
INSERT INTO "public"."Client" ("id", "name", "created_at", "updated_at", "currency_type_id", "billable_day", "rut", "address", "company_name") VALUES 
('12', 'Falabella Tecnología', '2025-02-11 14:14:50.827646+00', '2025-02-11 14:14:50.827646', '1', '20', '77.261.280-K', 'Av. Presidente Riesco 5435, piso 10, Las Condes, Santiago', 'Falabella Tecnología SpA'), 
('13', 'Cencosud', '2025-02-11 14:15:14.019188+00', '2025-02-11 14:15:14.019188', '1', '30', '93.834.000-5', 'Av. Kennedy 9001, Las Condes, Santiago', 'Cencosud S.A.'), 
('14', 'Sonda', '2025-02-11 14:15:40.376192+00', '2025-02-11 14:15:40.376192', '1', '30', '83.628.100-4', 'Av. Providencia 1760, Providencia, Santiago', 'SONDA S.A.'), 
('15', 'BCI', '2025-02-11 14:16:01.130814+00', '2025-02-11 14:16:01.130814', '1', '30', '97.006.000-6', 'Av. El Golf 125, Las Condes, Santiago', 'Banco de Crédito e Inversiones'), 
('16', 'FID Seguros', '2025-02-11 14:16:27.886445+00', '2025-02-11 14:16:27.886445', '1', '30', '76.732.306-8', 'Av. Apoquindo 3600, piso 12, Las Condes, Santiago', 'FID Chile Seguros Generales S.A.'), 
('17', 'Sodimac', '2025-02-11 14:16:54.714902+00', '2025-02-11 14:16:54.714902', '1', '30', '96.792.430-K', 'Av. Presidente Eduardo Frei Montalva 3092, Renca, Santiago', 'Sodimac S.A.'), 
('18', 'Logística Internacional', '2025-02-11 14:17:18.652575+00', '2025-02-11 14:17:18.652575', '1', '30', '76.344.250-0', 'Av. Américo Vespucio Norte 1561, Vitacura, Santiago', 'Logística Internacional Chile S.A.'), 
('19', 'Falabella Financiero / Microsoft', '2025-02-11 14:17:51.578031+00', '2025-02-11 14:17:51.578031', '1', '30', '76.046.822-5', 'Av. Isidora Goyenechea 2800, Las Condes, Santiago', 'Falabella Financiero S.A.'), 
('20', 'Falabella Financiero', '2025-02-11 14:18:18.445523+00', '2025-02-11 14:18:18.445523', '1', '30', '76.046.822-5', 'Av. Isidora Goyenechea 2800, Las Condes, Santiago', 'Falabella Financiero S.A.'), 
('21', 'WOM', '2025-02-11 14:18:41.206556+00', '2025-02-11 14:18:41.206556', '1', '30', '78.921.690-8', 'Av. Apoquindo 4501, Las Condes, Santiago', 'WOM S.A.'), 
('22', 'IKEA', '2025-02-11 14:19:00.920972+00', '2025-02-11 14:19:00.920972', '1', '30', '77.176.958-K', 'Av. Presidente Riesco 5335, Las Condes, Santiago', 'IKEA Chile SpA'), 
('23', 'SMU', '2025-02-11 14:19:41.461263+00', '2025-02-11 14:19:41.461263', '1', '30', '76.012.676-4', 'Av. Cerro Colorado 5240, Las Condes, Santiago', 'SMU S.A.'), 
('24', 'Falabella Tecnología / Retail', '2025-02-11 14:20:13.393392+00', '2025-02-11 14:20:13.393392', '1', '30', '77.261.280-K', 'Av. Presidente Riesco 5435, piso 10, Las Condes, Santiago', 'Falabella Tecnología SpA'), 
('25', 'Banco Internacional', '2025-02-11 14:21:26.150416+00', '2025-02-11 14:21:26.150416', '1', '30', '97.011.000-3', 'Av. Apoquindo 6550, Las Condes, Santiago', 'Banco Internacional'), 
('26', 'ITAU', '2025-02-11 14:21:41.714317+00', '2025-02-11 14:21:41.714317', '1', '30', '76.645.030-K', 'Av. Apoquindo 3457, Las Condes, Santiago', 'Itaú Corpbanca'), 
('27', 'Ernest&Young', '2025-02-11 14:22:00.091132+00', '2025-02-11 14:22:00.091132', '1', '30', '77.802.430-6', 'Av. Isidora Goyenechea 2800, piso 2, Las Condes, Santiago', 'Ernst & Young Servicios Profesionales de Auditoría y Asesorías Limitada'), 
('28', 'Copec', '2025-02-11 14:22:21.829893+00', '2025-02-11 14:22:21.829893', '1', '30', '99.520.000-7', 'Av. Apoquindo 2929, Las Condes, Santiago', 'Compañía de Petróleos de Chile COPEC S.A.'), 
('29', 'Mall Plaza', '2025-02-11 14:22:38.68039+00', '2025-02-11 14:22:38.68039', '1', '30', '96.795.700-K', 'Av. Américo Vespucio Norte 1737, Huechuraba, Santiago', 'Plaza S.A.');

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
INSERT INTO "public"."People" ("id", "name", "last_name", "email", "corporate_email", "role_id", "dni", "address", "sublocality", "locality", "administrative_area_level_1", "country", "nationality", "afp_institution_id", "health_institution_id", "seniority_id", "net_salary", "currency_type_id", "job_title_id", "fee", "birth", "client_id", "phone", "billable_day", "created_at", "updated_at") VALUES 
('1', 'Juan', 'Pérez', 'juan.perez@gmail.com', 'jperez@smartjob.cl', '1', '12345678-9', 'Calle 1 #123', 'Santiago Centro', 'Santiago', 'Región Metropolitana', 'Chile', 'Chilena', '1', '1', '1', '1000000', '1', '1', '500000', '1990-01-01', '15', '+56912345678', '8.0', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('2', 'María', 'González', 'maria.gonzalez@gmail.com', 'mgonzalez@smartjob.cl', '2', '87654321-0', 'Calle 2 #456', 'Providencia', 'Santiago', 'Región Metropolitana', 'Chile', 'Chilena', '2', '2', '2', '1200000', '1', '2', '600000', '1991-02-02', '16', '+56987654321', '8.0', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('3', 'Pedro', 'Rodríguez', 'pedro.rodriguez@gmail.com', 'prodriguez@smartjob.cl', '3', '23456789-1', 'Calle 3 #789', 'Las Condes', 'Santiago', 'Región Metropolitana', 'Chile', 'Chilena', '3', '3', '3', '1500000', '1', '3', '750000', '1992-03-03', '17', '+56923456789', '8.0', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662');


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
('11', 'Cosme', 'Fulanito', 'cosme@falabella.com', '+56930303030', '12', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662');


-- PreInvoice data
INSERT INTO "public"."PreInvoice" ("id", "client_id", "contact_id", "total", "status", "oc_number", "hes_number", "invoice_number", "month", "year", "value", "reject_note", "oc_amount", "edp_number", "created_at", "updated_at") VALUES 
('1', '12', '1', 2500000.00, 'DOWNLOADED', 'OC-001-2023', 'HES-001', null, 3, 2023, 2500000.00, null, null, null, '2023-03-15 10:10:09.698662+00', '2023-03-15 10:10:09.698662'),
('2', '13', '2', 3200000.00, 'PENDING', 'OC-002-2023', 'HES-002', null, 4, 2023, 3200000.00, null, null, null, '2023-04-10 11:15:09.698662+00', '2023-04-10 11:15:09.698662'),
('3', '14', '3', 2800000.00, 'APPROVED', 'OC-003-2023', 'HES-003', 'INV-001-2023', 5, 2023, 2800000.00, null, 2800000.00, 'EDP-001', '2023-05-20 09:30:09.698662+00', '2023-05-20 09:30:09.698662'),
('4', '15', '4', 1900000.00, 'REJECTED', 'OC-004-2023', 'HES-004', null, 6, 2023, 1900000.00, 'Missing documentation', null, null, '2023-06-05 14:20:09.698662+00', '2023-06-05 14:20:09.698662'),
('5', '16', '5', 3500000.00, 'PENDING', 'OC-005-2023', 'HES-005', null, 7, 2023, 3500000.00, null, null, null, '2023-07-12 16:45:09.698662+00', '2023-07-12 16:45:09.698662'),
('6', '17', '6', 2200000.00, 'DOWNLOADED', 'OC-006-2023', 'HES-006', null, 8, 2023, 2200000.00, null, null, null, '2023-08-03 10:25:09.698662+00', '2023-08-03 10:25:09.698662'),
('7', '18', '7', 4100000.00, 'APPROVED', 'OC-007-2023', 'HES-007', 'INV-002-2023', 9, 2023, 4100000.00, null, 4100000.00, 'EDP-002', '2023-09-18 13:40:09.698662+00', '2023-09-18 13:40:09.698662'),
('8', '19', '8', 2750000.00, 'PENDING', 'OC-008-2024', 'HES-008', null, 1, 2024, 2750000.00, null, null, null, '2024-01-22 09:15:09.698662+00', '2024-01-22 09:15:09.698662'),
('9', '20', '9', 3300000.00, 'DOWNLOADED', 'OC-009-2024', 'HES-009', null, 2, 2024, 3300000.00, null, null, null, '2024-02-14 11:30:09.698662+00', '2024-02-14 11:30:09.698662'),
('10', '21', '10', 2900000.00, 'PENDING', 'OC-010-2025', 'HES-010', null, 2, 2025, 2900000.00, null, null, null, '2025-02-27 14:21:25.008077+00', '2025-02-27 14:21:25.008077');


-- PreInvoiceDetail data
INSERT INTO "public"."PreInvoiceDetail" ("id", "pre_invoice_id", "person_id", "status", "value", "currency_type", "billable_days", "leave_days", "total_consume_days", "created_at", "updated_at") VALUES 
-- PreInvoice 1 (Falabella Tecnología, DOWNLOADED)
(1, 1, 1, 'ASSIGN', 1200000.00, 1, 20, 2, 22, '2023-03-15 10:15:09.698662+00', '2023-03-15 10:15:09.698662'),
(2, 1, 2, 'ASSIGN', 1300000.00, 1, 21, 0, 21, '2023-03-15 10:16:09.698662+00', '2023-03-15 10:16:09.698662'),
(3, 1, 3, 'NO_ASSIGN', 800000.00, 1, 18, 0, 18, '2023-03-15 10:17:09.698662+00', '2023-03-15 10:17:09.698662'),

-- PreInvoice 2 (Cencosud, PENDING)
(4, 2, 1, 'ASSIGN', 1500000.00, 1, 19, 3, 22, '2023-04-10 11:20:09.698662+00', '2023-04-10 11:20:09.698662'),
(5, 2, 2, 'ASSIGN', 1700000.00, 1, 22, 0, 22, '2023-04-10 11:21:09.698662+00', '2023-04-10 11:21:09.698662'),
(6, 2, 3, 'NO_ASSIGN', 900000.00, 1, 20, 0, 20, '2023-04-10 11:22:09.698662+00', '2023-04-10 11:22:09.698662'),

-- PreInvoice 3 (Sonda, APPROVED)
(7, 3, 1, 'ASSIGN', 1400000.00, 1, 21, 1, 22, '2023-05-20 09:35:09.698662+00', '2023-05-20 09:35:09.698662'),
(8, 3, 2, 'ASSIGN', 1400000.00, 1, 21, 1, 22, '2023-05-20 09:36:09.698662+00', '2023-05-20 09:36:09.698662'),

-- PreInvoice 4 (BCI, REJECTED)
(9, 4, 1, 'ASSIGN', 950000.00, 1, 19, 0, 19, '2023-06-05 14:25:09.698662+00', '2023-06-05 14:25:09.698662'),
(10, 4, 3, 'ASSIGN', 950000.00, 1, 19, 0, 19, '2023-06-05 14:26:09.698662+00', '2023-06-05 14:26:09.698662'),

-- PreInvoice 5 (FID Seguros, PENDING)
(11, 5, 2, 'ASSIGN', 1750000.00, 1, 20, 2, 22, '2023-07-12 16:50:09.698662+00', '2023-07-12 16:50:09.698662'),
(12, 5, 3, 'ASSIGN', 1750000.00, 1, 20, 2, 22, '2023-07-12 16:51:09.698662+00', '2023-07-12 16:51:09.698662'),

-- PreInvoice 6 (Sodimac, DOWNLOADED)
(13, 6, 1, 'ASSIGN', 1100000.00, 1, 22, 0, 22, '2023-08-03 10:30:09.698662+00', '2023-08-03 10:30:09.698662'),
(14, 6, 2, 'ASSIGN', 1100000.00, 1, 22, 0, 22, '2023-08-03 10:31:09.698662+00', '2023-08-03 10:31:09.698662'),

-- PreInvoice 7 (Logística Internacional, APPROVED)
(15, 7, 1, 'ASSIGN', 1350000.00, 1, 21, 1, 22, '2023-09-18 13:45:09.698662+00', '2023-09-18 13:45:09.698662'),
(16, 7, 2, 'ASSIGN', 1350000.00, 1, 21, 1, 22, '2023-09-18 13:46:09.698662+00', '2023-09-18 13:46:09.698662'),
(17, 7, 3, 'ASSIGN', 1400000.00, 1, 22, 0, 22, '2023-09-18 13:47:09.698662+00', '2023-09-18 13:47:09.698662'),

-- PreInvoice 8 (Falabella Financiero / Microsoft, PENDING)
(18, 8, 1, 'ASSIGN', 1375000.00, 1, 20, 2, 22, '2024-01-22 09:20:09.698662+00', '2024-01-22 09:20:09.698662'),
(19, 8, 2, 'ASSIGN', 1375000.00, 1, 20, 2, 22, '2024-01-22 09:21:09.698662+00', '2024-01-22 09:21:09.698662'),

-- PreInvoice 9 (Falabella Financiero, DOWNLOADED)
(20, 9, 1, 'ASSIGN', 1650000.00, 1, 22, 0, 22, '2024-02-14 11:35:09.698662+00', '2024-02-14 11:35:09.698662'),
(21, 9, 2, 'ASSIGN', 1650000.00, 1, 22, 0, 22, '2024-02-14 11:36:09.698662+00', '2024-02-14 11:36:09.698662'),

-- PreInvoice 10 (WOM, PENDING)
(22, 10, 1, 'ASSIGN', 950000.00, 1, 21, 0, 21, '2025-02-27 14:22:25.008077+00', '2025-02-27 14:22:25.008077'),
(23, 10, 2, 'ASSIGN', 950000.00, 1, 21, 0, 21, '2025-02-27 14:23:25.008077+00', '2025-02-27 14:23:25.008077'),
(24, 10, 3, 'ASSIGN', 1000000.00, 1, 22, 0, 22, '2025-02-27 14:24:25.008077+00', '2025-02-27 14:24:25.008077');

-- LeaveDays data
INSERT INTO "public"."LeaveDays" ("id", "person_id", "start_date", "end_date", "reason", "created_at", "updated_at") VALUES 
('1', '1', '2025-03-01', '2025-03-05', 'Vacaciones', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('2', '2', '2025-03-10', '2025-03-12', 'Enfermedad', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662'),
('3', '3', '2025-03-15', '2025-03-20', 'Vacaciones', '2025-02-11 15:10:09.698662+00', '2025-02-11 15:10:09.698662');


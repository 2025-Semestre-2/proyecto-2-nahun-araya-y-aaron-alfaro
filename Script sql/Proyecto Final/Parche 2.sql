USE PROYE1;
GO

/* 1.1 Agregar estado a Reservacion */
IF COL_LENGTH('dbo.Reservacion','estado') IS NULL
BEGIN
    ALTER TABLE dbo.Reservacion
    ADD estado NVARCHAR(10) NOT NULL
        CONSTRAINT DF_Reservacion_Estado DEFAULT ('ACTIVA');
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name='CK_Reservacion_Estado' AND parent_object_id=OBJECT_ID('dbo.Reservacion'))
BEGIN
    ALTER TABLE dbo.Reservacion
    ADD CONSTRAINT CK_Reservacion_Estado
    CHECK (estado IN ('ACTIVA','CERRADA'));
END
GO


/* 1.2 Factura: agregar estadoPago */
IF COL_LENGTH('dbo.Factura','estadoPago') IS NULL
BEGIN
    ALTER TABLE dbo.Factura
    ADD estadoPago NVARCHAR(12) NOT NULL
        CONSTRAINT DF_Factura_EstadoPago DEFAULT ('PENDIENTE');
END
GO

IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name='CK_Factura_EstadoPago' AND parent_object_id=OBJECT_ID('dbo.Factura'))
BEGIN
    ALTER TABLE dbo.Factura
    ADD CONSTRAINT CK_Factura_EstadoPago
    CHECK (estadoPago IN ('PENDIENTE','PAGADA'));
END
GO

/* 1.3 Permitir metodoPago NULL cuando está pendiente */
-- Quitar CHECK viejo (solo si existe)
IF EXISTS (SELECT 1 FROM sys.check_constraints WHERE name='CK_Factura_MetodoPago' AND parent_object_id=OBJECT_ID('dbo.Factura'))
BEGIN
    ALTER TABLE dbo.Factura DROP CONSTRAINT CK_Factura_MetodoPago;
END
GO

-- Permitir NULL en metodoPago
ALTER TABLE dbo.Factura ALTER COLUMN metodoPago NVARCHAR(20) NULL;
GO

-- Nuevo CHECK: si está PAGADA => metodoPago obligatorio; si está PENDIENTE => NULL permitido
IF NOT EXISTS (SELECT 1 FROM sys.check_constraints WHERE name='CK_Factura_MetodoPago_Estado' AND parent_object_id=OBJECT_ID('dbo.Factura'))
BEGIN
    ALTER TABLE dbo.Factura
    ADD CONSTRAINT CK_Factura_MetodoPago_Estado
    CHECK (
        (estadoPago = 'PENDIENTE' AND metodoPago IS NULL)
        OR
        (estadoPago = 'PAGADA' AND metodoPago IN ('Efectivo','Tarjeta'))
    );
END
GO

/* 1.4 Default para fechaHoraRegistro (si no lo tenías) */
IF NOT EXISTS (SELECT 1 FROM sys.default_constraints WHERE name='DF_Factura_FechaHoraRegistro')
BEGIN
    ALTER TABLE dbo.Factura
    ADD CONSTRAINT DF_Factura_FechaHoraRegistro DEFAULT (SYSDATETIME()) FOR fechaHoraRegistro;
END
GO

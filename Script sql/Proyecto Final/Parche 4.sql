USE PROYE1;
GO

IF COL_LENGTH('dbo.Factura','estadoPago') IS NULL
BEGIN
    ALTER TABLE dbo.Factura
    ADD estadoPago NVARCHAR(12) NOT NULL
        CONSTRAINT DF_Factura_EstadoPago DEFAULT ('PENDIENTE');
END
GO

IF NOT EXISTS (
    SELECT 1 FROM sys.check_constraints
    WHERE name='CK_Factura_EstadoPago'
      AND parent_object_id=OBJECT_ID('dbo.Factura')
)
BEGIN
    ALTER TABLE dbo.Factura
    ADD CONSTRAINT CK_Factura_EstadoPago
    CHECK (estadoPago IN ('PENDIENTE','PAGADA'));
END
GO

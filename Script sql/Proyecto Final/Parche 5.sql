USE PROYE1;
GO

-- Quitar CHECK viejo si existe
IF EXISTS (
    SELECT 1 FROM sys.check_constraints
    WHERE name='CK_Factura_MetodoPago'
      AND parent_object_id=OBJECT_ID('dbo.Factura')
)
BEGIN
    ALTER TABLE dbo.Factura DROP CONSTRAINT CK_Factura_MetodoPago;
END
GO

-- Cambiar metodoPago a NULLABLE
ALTER TABLE dbo.Factura ALTER COLUMN metodoPago NVARCHAR(20) NULL;
GO

-- Nuevo CHECK coherente con estadoPago
IF NOT EXISTS (
    SELECT 1 FROM sys.check_constraints
    WHERE name='CK_Factura_MetodoPago_Estado'
      AND parent_object_id=OBJECT_ID('dbo.Factura')
)
BEGIN
    ALTER TABLE dbo.Factura
    ADD CONSTRAINT CK_Factura_MetodoPago_Estado
    CHECK (
        (estadoPago='PENDIENTE' AND metodoPago IS NULL)
        OR
        (estadoPago='PAGADA' AND metodoPago IN ('Efectivo','Tarjeta'))
    );
END
GO

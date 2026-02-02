CREATE TABLE dbo.CredencialesCliente (
    idCliente INT NOT NULL PRIMARY KEY,
    passwordHash NVARCHAR(200) NOT NULL,
    fechaCreacion DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT FK_CredencialesCliente_Cliente
        FOREIGN KEY (idCliente) REFERENCES dbo.Cliente(idCliente)
);
GO

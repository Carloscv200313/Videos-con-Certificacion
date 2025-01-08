CREATE TABLE Usuarios (
    id_usuario INT Identity(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    contrase�a VARCHAR(255) NOT NULL,
    rol VARCHAR(255) NOT NULL
);
CREATE TABLE Videos (
    id_video INT Identity(1,1) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    url_video VARCHAR(500) NOT NULL
);
CREATE TABLE Progreso (
    id_usuario INT NOT NULL,
    id_video INT NOT NULL,
    tiempo_visto FLOAT DEFAULT 0, 
    completado BIT,
    PRIMARY KEY (id_usuario, id_video),
    FOREIGN KEY (id_usuario) REFERENCES Usuarios(id_usuario),
    FOREIGN KEY (id_video) REFERENCES Videos(id_video)
);



INSERT INTO Usuarios (nombre, email, contrase�a, rol)
VALUES 
('Juan P�rez', 'juan', 'juan', 'empleado'),
('Ana L�pez', 'ana', 'ana', 'empleado'),
('Carlos Calderon', 'carlos', 'carlos', 'gerente');

CREATE OR ALTER PROCEDURE Validar_usuario (
    @email NVARCHAR(100),         -- Entrada: Email del usuario
    @contrasena NVARCHAR(100)     -- Entrada: Contrase�a del usuario
)
AS
BEGIN
    -- Declaramos variables para manejar los resultados
    DECLARE @id_usuario INT;
    DECLARE @mensaje NVARCHAR(100);

    -- Verificar si el email existe
    SELECT @id_usuario = id_usuario
    FROM Usuarios
    WHERE email = @email;

    -- Si el email no existe, devolver mensaje
    IF @id_usuario IS NULL
    BEGIN
        SET @mensaje = 'El correo no est� registrado';
        SELECT @mensaje AS mensaje;
        RETURN;
    END

    -- Si el email existe, verificar la contrase�a
    IF EXISTS (
        SELECT 1
        FROM Usuarios
        WHERE id_usuario = @id_usuario AND contrase�a = @contrasena
    )
    BEGIN
        -- Credenciales correctas, devolver la informaci�n del usuario
        SELECT nombre,rol,id_usuario
        FROM Usuarios
        WHERE id_usuario = @id_usuario;
    END
    ELSE
    BEGIN
        -- Contrase�a incorrecta, devolver mensaje
        SET @mensaje = 'Contrase�a incorrecta';
        SELECT @mensaje AS mensaje;
    END
END;



EXEC Validar_usuario 'juan', 'juan';

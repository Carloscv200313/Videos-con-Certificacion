CREATE OR ALTER PROCEDURE Validar_usuario (
    @correo NVARCHAR(100),         -- Entrada: Email del usuario
    @contrasena NVARCHAR(100)     -- Entrada: Contraseña del usuario
)
AS
BEGIN
    -- Declaramos variables para manejar los resultados
    DECLARE @id_usuario INT;
    DECLARE @mensaje NVARCHAR(100);

    -- Verificar si el email existe
    SELECT @id_usuario = id
    FROM Usuarios
    WHERE correo = @correo;

    -- Si el email no existe, devolver mensaje
    IF @id_usuario IS NULL
    BEGIN
        SET @mensaje = 'El correo no está registrado';
        SELECT @mensaje AS mensaje;
        RETURN;
    END

    -- Si el email existe, verificar la contraseña
    IF EXISTS (
        SELECT 1
        FROM Usuarios
        WHERE id = @id_usuario AND contraseña = @contrasena
    )
    BEGIN
        -- Credenciales correctas, devolver la información del usuario
        SELECT nombre,rol,id
        FROM Usuarios
        WHERE id = @id_usuario;
    END
    ELSE
    BEGIN
        -- Contraseña incorrecta, devolver mensaje
        SET @mensaje = 'Contraseña incorrecta';
        SELECT @mensaje AS mensaje;
    END
END;










CREATE OR ALTER PROCEDURE cursosAlumnos(
	@idUsuario INT
)
AS
BEGIN
	Select
		p.progreso AS Progreso,
		u.nombre AS Usuario,
		c.id AS CursoId,
		c.nombre AS NombreCurso,
		c.descripcion AS DescripcionCurso
	from 
	Progresos p  
	INNER JOIN 
		Cursos c ON p.cursoId = c.id
	INNER JOIN 
		Usuarios u ON p.alumnoId = u.id
	where alumnoId=@idUsuario ;
END;


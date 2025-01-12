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
    SELECT
        p.progreso AS VideosVistos,
        u.nombre AS Usuario,
        c.id AS CursoId,
        c.nombre AS NombreCurso,
        c.descripcion AS DescripcionCurso,
        c.cantidadVideos AS CantidadVideos,
        (SELECT TOP 1 v.id
         FROM Videos v
         WHERE v.cursoId = c.id
         ORDER BY v.orden ASC) AS PrimerVideoId
    FROM 
        Progresos p  
    INNER JOIN 
        Cursos c ON p.cursoId = c.id
    INNER JOIN 
        Usuarios u ON p.alumnoId = u.id
    WHERE 
        alumnoId = @idUsuario;
END;























CREATE OR ALTER PROCEDURE ActivarCurso(
    @idUsuario INT,
    @idPrimerVideo INT,
    @idCurso INT
)
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Actualizar el progreso del curso en la tabla Progresos
        UPDATE Progresos
        SET progreso = progreso + 1
        WHERE alumnoId = @idUsuario AND cursoId = @idCurso;

        -- Cambiar el estado del video en la tabla ProgresoVideo
        UPDATE ProgresoVideo
        SET estado = 1
        WHERE alumnoId = @idUsuario AND videoId = @idPrimerVideo;

        -- Verificar si las filas fueron afectadas
        IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'No se pudo actualizar el estado del video o progreso del curso.', 1;
        END

        -- Confirmar la transacción
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- En caso de error, revertir la transacción
        ROLLBACK TRANSACTION;

        -- Re-lanzar el error para depuración
        THROW;
    END CATCH
END;





CREATE OR ALTER PROCEDURE ReiniciarCurso(
    @idUsuario INT,
    @idCurso INT
)
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Reiniciar el progreso del curso en la tabla Progresos
        UPDATE Progresos
        SET progreso = 0
        WHERE alumnoId = @idUsuario AND cursoId = @idCurso;

        -- Desactivar el estado de todos los videos del curso en la tabla ProgresoVideo
        UPDATE ProgresoVideo
        SET estado = 0
        WHERE alumnoId = @idUsuario AND videoId IN (
            SELECT id FROM Videos WHERE cursoId = @idCurso
        );

        -- Verificar si se actualizaron las filas en ambas tablas
        IF @@ROWCOUNT = 0
        BEGIN
            THROW 50002, 'No se pudo reiniciar el curso ni desactivar los videos.', 1;
        END

        -- Confirmar la transacción
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        -- En caso de error, revertir la transacción
        ROLLBACK TRANSACTION;

        -- Re-lanzar el error para depuración
        THROW;
    END CATCH
END;














CREATE OR ALTER PROCEDURE ObtenerVideos(
    @idCurso INT,
    @idUsuario INT
)
AS
BEGIN
    -- Seleccionar los videos del curso junto con su estado para el usuario especificado
    SELECT 
        v.id AS VideoId,
        v.titulo AS Titulo,
        v.link AS Link,
        v.orden AS Orden,
        ISNULL(pv.estado, 0) AS Estado -- Si no hay registro en ProgresoVideo, el estado será 0
    FROM 
        Videos v
    LEFT JOIN 
        ProgresoVideo pv ON v.id = pv.videoId AND pv.alumnoId = @idUsuario
    WHERE 
        v.cursoId = @idCurso
    ORDER BY 
        v.orden; -- Ordenar los videos según el campo 'orden'
END;

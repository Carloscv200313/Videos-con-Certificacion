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






CREATE OR ALTER PROCEDURE VideoTerminado(
    @idUsuario INT,
    @idVideo INT,
    @idCurso INT
)
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        BEGIN
            -- Si el video está marcado como visto, incrementar el progreso del curso
            UPDATE Progresos
            SET progreso = progreso + 1
            WHERE alumnoId = @idUsuario AND cursoId = @idCurso;
			        -- Actualizar el estado del video como visto
			UPDATE ProgresoVideo
			SET VideoVisto = 1
			WHERE alumnoId = @idUsuario AND videoId = @idVideo;
		END
        -- Verificar si las actualizaciones afectaron filas
        IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'No se pudo actualizar el estado del video.', 1;
        END

        -- Confirmar la transacción
        COMMIT TRANSACTION;

        -- Retornar mensaje como resultado
        SELECT '¡El video ha terminado exitosamente!' AS Mensaje;
    END TRY
    BEGIN CATCH
        -- En caso de error, revertir la transacción
        ROLLBACK TRANSACTION;

        -- Re-lanzar el error para depuración
        THROW;
    END CATCH
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
        SET estado = 0 , VideoVisto=0
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
        ISNULL(pv.estado, 0) AS Estado,-- Si no hay registro en ProgresoVideo, el estado será 0
		pv.VideoVisto
    FROM 
        Videos v
    LEFT JOIN 
        ProgresoVideo pv ON v.id = pv.videoId AND pv.alumnoId = @idUsuario
    WHERE 
        v.cursoId = @idCurso
    ORDER BY 
        v.orden; -- Ordenar los videos según el campo 'orden'
END;






























CREATE OR ALTER PROCEDURE IdVideo(
    @idCurso INT,
    @idUsuario INT,
    @idVideo INT
)
AS
BEGIN
    -- Declarar una variable para almacenar el ID del siguiente video
    DECLARE @idVideoSiguiente INT;

    -- Buscar el ID del siguiente video basado en el campo 'orden'
    SELECT TOP 1 @idVideoSiguiente = v.id
    FROM Videos v
    WHERE v.cursoId = @idCurso AND v.orden > (
        SELECT orden FROM Videos WHERE id = @idVideo
    )
    ORDER BY v.orden ASC;

    -- Seleccionar el video actual con el campo adicional para el siguiente video
    SELECT 
        v.id AS VideoId,
        v.titulo AS Titulo,
        v.link AS Link,
        v.orden AS Orden,
		ISNULL(pv.VideoVisto,0) AS VideoVisto,
        ISNULL(pv.estado, 0) AS Estado, -- Si no hay registro en ProgresoVideo, el estado será 0
        @idVideoSiguiente AS idVideoSiguiente -- Agregar el ID del siguiente video si existe
    FROM 
        Videos v
    LEFT JOIN 
        ProgresoVideo pv ON v.id = pv.videoId AND pv.alumnoId = @idUsuario
    WHERE 
        v.id = @idVideo AND pv.estado=1
END;





























CREATE OR ALTER PROCEDURE ActualizarSiguienteVideo(
    @idCurso INT,
    @idUsuario INT,
    @idVideo INT
)
AS
BEGIN
    -- Declarar una variable para almacenar el ID del siguiente video
    DECLARE @idSiguienteVideo INT;

    -- Buscar el ID del siguiente video basado en el campo 'orden'
    SELECT TOP 1 @idSiguienteVideo = v.id
    FROM Videos v
    WHERE v.cursoId = @idCurso AND v.orden > (
        SELECT orden FROM Videos WHERE id = @idVideo
    )
    ORDER BY v.orden ASC;

    -- Si no hay un siguiente video, salir del procedimiento
    IF @idSiguienteVideo IS NULL
    BEGIN

		UPDATE Progresos
			SET examenHabilitado = 1
			where alumnoId = @idUsuario and cursoId = @idCurso;

        SELECT * 
		    FROM Videos 
		    WHERE id = @idVideo;
        RETURN;
    END

    -- Verificar si el estado del siguiente video ya está activo
    IF EXISTS (
        SELECT 1 
        FROM ProgresoVideo 
        WHERE alumnoId = @idUsuario AND videoId = @idSiguienteVideo AND estado = 1
    )
    BEGIN
			SELECT * 
		    FROM Videos 
		    WHERE id = @idSiguienteVideo;
        RETURN;
    END

    -- Activar el estado del siguiente video en la tabla ProgresoVideo
    IF NOT EXISTS (
        SELECT 1 
        FROM ProgresoVideo 
        WHERE alumnoId = @idUsuario AND videoId = @idSiguienteVideo
    )
    BEGIN
        INSERT INTO ProgresoVideo (alumnoId, videoId, estado)
        VALUES (@idUsuario, @idSiguienteVideo, 1);
    END
    ELSE
    BEGIN
        UPDATE ProgresoVideo
        SET estado = 1
        WHERE alumnoId = @idUsuario AND videoId = @idSiguienteVideo;
    END



    -- Devolver el siguiente video activado
    SELECT * 
    FROM Videos 
    WHERE id = @idSiguienteVideo;
END;



























CREATE OR ALTER PROCEDURE ObtenerProgresoCurso
    @CursoId Int
AS
BEGIN
    SELECT 
        U.id AS UsuarioId,
        U.nombre AS NombreUsuario,
        P.progreso AS VideosVistos,
        P.examenHabilitado AS ExamenHabilitado,
        P.notaFinal AS NotaFinalCurso,
		C.cantidadVideos AS CantidadCursos,
		C.nombre AS NombreCurso
    FROM 
        Usuarios U
    INNER JOIN 
        Progresos P ON U.id = P.alumnoId
	INNER JOIN 
        Cursos C ON C.id = P.cursoId
    WHERE 
        P.cursoId = @CursoId
    ORDER BY 
        U.id;
END;










CREATE OR ALTER PROCEDURE CursoProgreso(
    @idUsuario INT,
	@idCurso INT
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
        alumnoId = @idUsuario AND c.id=@idCurso ;
END;





















CREATE OR ALTER PROCEDURE CambiarEstado(
    @idUsuario INT,
    @idCurso INT
)
AS
BEGIN
    BEGIN TRANSACTION;

    BEGIN TRY
        -- Actualizar el progreso del curso en la tabla Progresos
        UPDATE Progresos
        SET examenHabilitado = 1
        WHERE alumnoId = @idUsuario AND cursoId = @idCurso;
        
        -- Verificar si las filas fueron afectadas
        IF @@ROWCOUNT = 0
        BEGIN
            THROW 50001, 'No se pudo actualizar el estado del video o progreso del curso.', 1;
        END

        -- Confirmar la transacción
        COMMIT TRANSACTION;

        -- Retornar mensaje de éxito
        SELECT '¡El estado del examen ha sido habilitado exitosamente!' AS Mensaje;
    END TRY
    BEGIN CATCH
        -- En caso de error, revertir la transacción
        ROLLBACK TRANSACTION;

        -- Re-lanzar el error para depuración
        THROW;
    END CATCH
END;







CREATE OR ALTER PROCEDURE ObtenerDatosProcesos
    @IdAlumno INT
AS
BEGIN
    SELECT 
        p.alumnoId AS IdAlumno,
        p.cursoId AS IdCurso,
        c.nombre AS NombreCurso, -- Se agrega el nombre del curso desde la tabla Cursos
        p.progreso AS ProgresoCurso,
        p.examenHabilitado AS ExamenHabilitado,
        p.notaFinal AS NotaFinal,
        p.Intentos AS CantidadIntentos,
        p.linkExamen AS EnlaceExamen
    FROM  
        Progresos p
    INNER JOIN 
        Cursos c ON p.cursoId = c.id -- Relaciona Progresos con Cursos
    WHERE 
        p.alumnoId = @IdAlumno;
END;




















CREATE OR ALTER PROCEDURE ObtenerYActualizarProcesos
    @IdAlumno INT,
    @IdCurso INT
AS
BEGIN
    -- Actualizar los datos: deshabilitar examen y agregar un intento
    UPDATE Progresos
    SET 
        examenHabilitado = 0, -- Cambiar a false (en SQL es 0)
        Intentos = Intentos + 1 -- Incrementar los intentos en 1
    WHERE 
        alumnoId = @IdAlumno AND
        cursoId = @IdCurso;

    -- Devolver los datos actualizados para el alumno y curso específicos
    SELECT 
        alumnoId AS IdAlumno,
        cursoId AS IdCurso,
        progreso AS ProgresoCurso,
        examenHabilitado AS ExamenHabilitado,
        notaFinal AS NotaFinal,
        Intentos AS CantidadIntentos,
        linkExamen AS EnlaceExamen
    FROM Progresos
    WHERE 
        alumnoId = @IdAlumno AND
        cursoId = @IdCurso;
END;








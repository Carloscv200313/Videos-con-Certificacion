-- Creación de la tabla Usuarios
CREATE TABLE Usuarios (
    id INT PRIMARY KEY Identity(1,1),
    nombre VARCHAR(100),
    correo VARCHAR(150) UNIQUE,
    contraseña VARCHAR(255),
    rol VARCHAR(20) -- Cambiado a VARCHAR(20)
);

-- Creación de la tabla Cursos
CREATE TABLE Cursos (
    id INT PRIMARY KEY Identity(1,1),
    nombre VARCHAR(100),
    descripcion TEXT,
    profesorId INT,
    fechaCreacion DATE,
    FOREIGN KEY (profesorId) REFERENCES Usuarios(id)
);

-- Creación de la tabla Videos
CREATE TABLE Videos (
    id INT PRIMARY KEY Identity(1,1),
    cursoId INT,
    titulo VARCHAR(100),
    descripcion TEXT,
    url VARCHAR(255),
    duracion DECIMAL(5,2), -- Cambiado a DECIMAL para permitir valores con decimales
    orden INT,
    fechaSubida DATE,
    FOREIGN KEY (cursoId) REFERENCES Cursos(id)
);

ALTER TABLE Videos
DROP CONSTRAINT FK_Videos_Usuarios;


ALTER TABLE Videos
DROP COLUMN idUsuario;


select * from Videos
-- Creación de la tabla Progresos
CREATE TABLE Progresos (
    alumnoId INT,
    cursoId INT,
    videosVistos INT, -- Guarda un array con los videos completados
    examenHabilitado bit,
    notaFinal DECIMAL(5,2),
    fechaUltimaActividad DATE,
    PRIMARY KEY (alumnoId, cursoId), -- Cambiado el PK a alumnoId y cursoId
    FOREIGN KEY (alumnoId) REFERENCES Usuarios(id),
    FOREIGN KEY (cursoId) REFERENCES Cursos(id)
);

CREATE TABLE ProgresoVideos (
    idUsuario INT,
    idVideo INT,
    tiempoVisto DECIMAL(5,2),
	estado bit,
    PRIMARY KEY (idUsuario, idVideo),
    FOREIGN KEY (idUsuario) REFERENCES Usuarios(id),
    FOREIGN KEY (idVideo) REFERENCES Videos(id)
);

INSERT INTO ProgresoVideos (idUsuario, idVideo, tiempoVisto,estado)
VALUES 
    (1, 1, 0,0),
    (1, 2, 0,0),
    (1, 3, 0,0),
	(1, 4, 0,0),
	(1, 5, 0,0),
	(1, 6, 0,0),
	(1, 7, 0,0),
	(1, 8, 0,0),
	(1, 9, 0,0),
	(1, 10, 0,0),
	(1, 11, 0,0),
	(1, 12, 0,0);



select * from ProgresoVideos

CREATE or Alter PROCEDURE ObtenerVideosPorCursoConProgreso
    @CursoId INT,
    @UsuarioId INT
AS
BEGIN
    -- Seleccionar los videos y el progreso relacionado con el curso y usuario proporcionados
    SELECT 
        v.id AS VideoId,
        v.titulo AS TituloVideo,
        v.descripcion AS DescripcionVideo,
        v.url AS UrlVideo,
        v.duracion AS DuracionVideo,
        v.orden AS OrdenVideo,
        v.fechaSubida AS FechaSubidaVideo,
        pv.tiempoVisto AS TiempoVisto,
        pv.estado AS EstadoProgreso
    FROM Videos v
    LEFT JOIN ProgresoVideos pv ON v.id = pv.idVideo AND pv.idUsuario = @UsuarioId
    WHERE v.cursoId = @CursoId;
END;


EXEC ObtenerVideosPorCursoConProgreso @CursoId = 3, @UsuarioId = 1;




CREATE OR ALTER PROCEDURE IDvideo
    @idUsuario INT,
    @idVideo INT
AS
BEGIN
    SELECT 
        pv.tiempoVisto,
        pv.estado,
        v.url
    FROM 
        ProgresoVideos pv
    INNER JOIN 
        Videos v ON pv.idVideo = v.id
    WHERE 
        pv.idUsuario = @idUsuario AND 
        pv.idVideo = @idVideo;
END;
GO





EXEC IDvideo @idUsuario = 1, @idVideo = 1;





CREATE OR ALTER PROCEDURE ActualizarTiempoVisto
    @idUsuario INT,
    @idVideo INT,
    @tiempoVisto DECIMAL(5,2)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRANSACTION;

    BEGIN TRY
        -- Actualizar el tiempo visualizado del video actual
        UPDATE ProgresoVideos
        SET tiempoVisto = @tiempoVisto, estado = 1
        WHERE idUsuario = @idUsuario AND idVideo = @idVideo;

        -- Obtener el curso al que pertenece el video actual y el orden del video
        DECLARE @cursoId INT, @ordenActual INT;
        SELECT @cursoId = v.cursoId, @ordenActual = v.orden
        FROM Videos v
        WHERE v.id = @idVideo;

        -- Activar el estado del siguiente video (si existe)
        UPDATE ProgresoVideos
        SET estado = 1
        WHERE idUsuario = @idUsuario
          AND idVideo = (
              SELECT TOP 1 id
              FROM Videos
              WHERE cursoId = @cursoId AND orden > @ordenActual
              ORDER BY orden ASC
          );

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;

        -- Manejar errores
        THROW;
    END CATCH
END;













-- Creación de la tabla Examenes
CREATE TABLE Examenes (
    id INT PRIMARY KEY Identity(1,1),
    cursoId INT,
    preguntas VARCHAR(100), -- Cambiado de JSON a VARCHAR(100)
    FOREIGN KEY (cursoId) REFERENCES Cursos(id)
);

-- Creación de la tabla Resultados de Examenes
CREATE TABLE Resultados_Examenes (
    alumnoId INT,
    cursoId INT,
    preguntasRespondidas INT, -- Cambiado de JSON a INT
    nota DECIMAL(5,2),
    fechaExamen DATE,
    PRIMARY KEY (alumnoId, cursoId), -- Cambiado el PK a alumnoId y cursoId
    FOREIGN KEY (alumnoId) REFERENCES Usuarios(id),
    FOREIGN KEY (cursoId) REFERENCES Cursos(id)
);



INSERT INTO Usuarios (nombre, correo, contraseña, rol)
VALUES 
('Juan Pérez', 'juan', 'juan', 'empleado'),
('Ana López', 'ana', 'ana', 'empleado'),
('Carlos Calderon', 'carlos', 'carlos', 'gerente');


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



EXEC Validar_usuario 'juan', 'juan';

CREATE OR ALTER PROCEDURE ObtenerCursos
AS
BEGIN
	Select id,nombre,descripcion from Cursos
END;


EXEC ObtenerCursos



-- Insertar datos en la tabla Usuarios
INSERT INTO Usuarios (nombre, correo, contraseña, rol) VALUES
('Juan Pérez', 'juan.perez@ejemplo.com', 'contraseña123', 'Profesor'),
('María Gómez', 'maria.gomez@ejemplo.com', 'contraseña123', 'Alumno'),
('Carlos López', 'carlos.lopez@ejemplo.com', 'contraseña123', 'Alumno');

-- Insertar datos en la tabla Cursos
INSERT INTO Cursos (nombre, descripcion, profesorId, fechaCreacion) VALUES
('Curso de Programación en Python', 'Aprende los fundamentos de Python', 3, '2025-01-01'),
('Curso de Desarrollo Web', 'HTML, CSS y JavaScript desde cero', 3, '2025-01-02'),
('Curso de Bases de Datos', 'Fundamentos de bases de datos relacionales', 3, '2025-01-03');

-- Insertar datos en la tabla Videos
INSERT INTO Videos (cursoId, titulo, descripcion, url, duracion, orden, fechaSubida) VALUES
-- Videos del Curso de Programación en Python (id=1)
(1, 'Introducción a Python', 'Conceptos básicos del lenguaje', '/video_01.mp4', 13.00, 1, '2025-01-01'),
(1, 'Estructuras de Control', 'Condicionales y bucles', '/video_01.mp4', 13.00 , 2, '2025-01-02'),
(1, 'Funciones en Python', 'Definición y uso de funciones', '/video_01.mp4', 13.00, 3, '2025-01-03'),
(1, 'Programación Orientada a Objetos', 'Clases y objetos en Python', '/video_01.mp4', 13.00, 4, '2025-01-04'),

-- Videos del Curso de Desarrollo Web (id=2)
(2, 'Introducción a HTML', 'Estructura básica de un documento HTML', '/video_02.mp4', 12.00, 1, '2025-01-01'),
(2, 'CSS Básico', 'Estilizando con CSS', '/video_02.mp4', 12.00, 2, '2025-01-02'),
(2, 'Introducción a JavaScript', 'Funciones y eventos en JavaScript', '/video_02.mp4', 12.00, 3, '2025-01-03'),
(2, 'Proyecto Final: Página Web Completa', 'Combinación de HTML, CSS y JS', '/video_02.mp4', 12.00, 4, '2025-01-04'),

-- Videos del Curso de Bases de Datos (id=3)
(3, 'Introducción a las Bases de Datos', 'Conceptos y objetivos', '/video_03.mp4', 85.00, 1, '2025-01-01'),
(3, 'SQL Básico', 'Escribiendo consultas simples', '/video_03.mp4', 85.00, 2, '2025-01-02'),
(3, 'Normalización', 'Primeras formas normales', '/video_03.mp4', 85.00, 3, '2025-01-03'),
(3, 'Conexión con Aplicaciones', 'Usando bases de datos en proyectos', '/video_03.mp4', 85.00, 4, '2025-01-04');

-- Insertar datos en la tabla Progresos
INSERT INTO Progresos (alumnoId, cursoId, videosVistos, examenHabilitado, notaFinal, fechaUltimaActividad) VALUES
(1, 1, 0,  0, NULL, '2025-01-07'),
(1, 2, 0,  0, NULL, '2025-01-07'),
(1, 3, 0,  0, NULL, '2025-01-07');

CREATE OR ALTER PROCEDURE CursoAlumnoID
    @AlumnoId INT -- Parámetro de entrada para el ID del alumno
AS
BEGIN
    SELECT 
        c.id AS idCurso,
        u.id AS idUsuario,
        v.VideoId AS PrimerVideoId,
        c.nombre AS NombreCurso,
		p.videosVistos AS Videosvistos,
        c.descripcion AS DescripcionCurso,
        (SELECT COUNT(*) FROM Videos WHERE cursoId = c.id) AS TotalVideos,
        CASE 
            WHEN (SELECT COUNT(*) FROM Videos WHERE cursoId = c.id) = 0 THEN 0
            ELSE (p.videosVistos * 100) / (SELECT COUNT(*) FROM Videos WHERE cursoId = c.id)
        END AS AvancePorcentaje
    FROM 
        Usuarios u
    INNER JOIN 
        Progresos p ON u.id = p.alumnoId
    INNER JOIN 
        Cursos c ON p.cursoId = c.id
    LEFT JOIN 
        (SELECT 
             cursoId,
             id AS VideoId
         FROM 
             (SELECT 
                  id, 
                  cursoId,
                  ROW_NUMBER() OVER (PARTITION BY cursoId ORDER BY id) AS RowNum
              FROM Videos) AS RankedVideos
         WHERE RowNum = 1) v ON c.id = v.cursoId
    WHERE 
        u.id = @AlumnoId -- Filtramos por el ID del alumno
    ORDER BY 
        c.id;
END








CREATE OR ALTER PROCEDURE AumentarVideosVistos
    @AlumnoId INT,        -- ID del alumno
    @CursoId INT,         -- ID del curso
    @VideosCompletados INT -- Número de videos a aumentar
AS
BEGIN
    -- Verificar si el alumno ya tiene un progreso en el curso
    IF EXISTS (SELECT 1 FROM Progresos WHERE alumnoId = @AlumnoId AND cursoId = @CursoId)
    BEGIN
        -- Actualizar los videosVistos sumando la cantidad de videos completados
        UPDATE Progresos
        SET videosVistos =  @VideosCompletados
        WHERE alumnoId = @AlumnoId AND cursoId = @CursoId;
    END
    ELSE
    BEGIN
        -- Si no existe el progreso, insertamos un nuevo registro
        INSERT INTO Progresos (alumnoId, cursoId, videosVistos, examenHabilitado, notaFinal, fechaUltimaActividad)
        VALUES (@AlumnoId, @CursoId, @VideosCompletados, 0, NULL, GETDATE());
    END
END



EXEC AumentarVideosVistos @AlumnoId = 1, @CursoId = 1, @VideosCompletados = 0;


EXEC CursoAlumnoID @AlumnoId = 1;

(2, 2, 2, 0, NULL, '2025-01-05'),
(2, 3, 1, 0, NULL, '2025-01-06');

-- Insertar datos en la tabla Examenes
INSERT INTO Examenes (cursoId, preguntas) VALUES
(1, ''),
(2, 'Pregunta 1, Pregunta 2, Pregunta 3'),
(3, 'Pregunta 1, Pregunta 2, Pregunta 3');

-- Insertar datos en la tabla Resultados_Examenes
INSERT INTO Resultados_Examenes (alumnoId, cursoId, preguntasRespondidas, nota, fechaExamen) VALUES
(2, 1, 3, 85.50, '2025-01-07'),
(2, 2, 2, NULL, NULL),
(3, 3, 1, NULL, NULL);

SELECT 
*
FROM 
    Usuarios;


SELECT 
*
FROM 
    Cursos;


SELECT 
    id AS VideoId, 
    cursoId AS CursoId, 
    titulo AS TituloVideo, 
    link AS LinkVideo, 
    orden AS OrdenVideo
FROM 
    Videos;




SELECT 
*
FROM 
    Progresos




SELECT * FROM ProgresoVideo






ALTER TABLE Progresos
ADD Intentos INT 


ALTER TABLE Progresos
ADD linkExamen VARCHAR(200) ;


UPDATE Progresos
SET linkExamen = 'https://docs.google.com/forms/d/e/1FAIpQLScfgF748UUHK3ioYzRujrAk5vo2UiptPqnFtORt5PxcJGCnWw/viewform?usp=sharing'
WHERE cursoId = 3;



ALTER TABLE Progresos
DROP COLUMN examen3;


UPDATE Progresos
SET Intentos = 0;


ALTER TABLE ProgresoVideo
ADD VideoVisto BIT ;


UPDATE ProgresoVideo
SET VideoVisto = 0;





CREATE TABLE Examen (
    id INT PRIMARY KEY IDENTITY(1,1), -- Clave primaria con auto-incremento
    link VARCHAR(255) NOT NULL, -- Enlace del examen
    idCurso INT NOT NULL, -- Clave foránea que se relaciona con Cursos
    CONSTRAINT FK_Examen_Cursos FOREIGN KEY (idCurso) REFERENCES Cursos(id) -- Definición de la clave foránea
);

SELECT 
*
FROM 
Examen

ALTER TABLE Examen
ADD idUsuario INT 

ALTER TABLE Examen
ADD CONSTRAINT FK_Examen_Usuarios FOREIGN KEY (idUsuario) REFERENCES Usuarios(id);



INSERT INTO Examen (link, idCurso)
VALUES 
    ('https://docs.google.com/forms/d/e/1FAIpQLSeC6RsWbdxtzyK4qwOw4XMJWl-H7A_8Mi8nJc6_Zgx2MJrrlQ/viewform?usp=sharing', 1),
    ('https://forms.gle/hYRabpsdoubQeLSj7', 1),
    ('https://forms.gle/DcGFSiWz5znFg8ie6', 1);

























	-- Eliminar referencias en la tabla ProgresoVideo
DELETE FROM ProgresoVideo
WHERE videoId IN (
    SELECT id 
    FROM Videos
    WHERE cursoId IN (2, 3)
);

-- Eliminar referencias en la tabla Progresos
DELETE FROM Progresos
WHERE cursoId IN (2, 3);

-- Eliminar referencias en la tabla Examen
DELETE FROM Examen
WHERE idCurso IN (2, 3);

-- Eliminar los videos asociados a los cursos
DELETE FROM Videos
WHERE cursoId IN (2, 3);

-- Finalmente, eliminar los cursos
DELETE FROM Cursos
WHERE id IN (2, 3);






UPDATE Cursos
SET nombre = 'Capacitacion inicial para asesores de cobranza de expertis',
    descripcion = NULL,
    cantidadVideos = 11
WHERE id = 1;



ALTER TABLE Cursos
DROP COLUMN descripcion;



UPDATE Videos
SET titulo = 'CONSULTA CLIENTE'
WHERE id = 1;

UPDATE Videos
SET titulo = 'INGRESO DE PPC'
WHERE id = 2;

UPDATE Videos
SET titulo = 'INGRESO DE PPC CON ABONO'
WHERE id = 3;

UPDATE Videos
SET titulo = 'INGRESO DE PPM'
WHERE id = 4;

-- Insertar los nuevos videos y asociarlos al curso con id = 1
-- Actualizar el curso con id = 1
UPDATE Cursos
SET nombre = 'Capacitacion inicial para asesores de cobranza de expertis',
    cantidadVideos = 11
WHERE id = 1;

-- Modificar los títulos y links de los videos existentes con id 1, 2, 3, 4
UPDATE Videos
SET titulo = 'CONSULTA CLIENTE',
    link = 'https://res.cloudinary.com/dtjsttl1h/video/upload/v1737995445/1.CONSULTA_CLIENTE_e006yj.mp4'
WHERE id = 1;

UPDATE Videos
SET titulo = 'INGRESO DE PPC',
    link = 'https://res.cloudinary.com/dtjsttl1h/video/upload/v1737995431/2.INGRESO_DE_PPC_elqcjd.mp4'
WHERE id = 2;

UPDATE Videos
SET titulo = 'INGRESO DE PPC CON ABONO',
    link = 'https://res.cloudinary.com/dtjsttl1h/video/upload/v1737995431/3.INGRESO_DE_PPC_CON_ABONO_vsil2n.mp4'
WHERE id = 3;

UPDATE Videos
SET titulo = 'INGRESO DE PPM',
    link = 'https://res.cloudinary.com/dtjsttl1h/video/upload/v1737995431/4.INGRESO_DE_PPM_kbjfnj.mp4'
WHERE id = 4;

-- Insertar los nuevos videos con títulos y links, asociados al curso con id = 1
INSERT INTO Videos (cursoId, titulo, link, orden)
VALUES 
(1, 'INGRESO DE PAR', 'https://res.cloudinary.com/dtjsttl1h/video/upload/v1737995448/5.INGRESO_DE_PAR_lqvbhz.mp4', 5),
(1, 'INGRESO DE VLL', 'https://res.cloudinary.com/dtjsttl1h/video/upload/v1737995434/6._INGRESO_DE_VLL_rm7pdy.mp4', 6),
(1, 'GESTIÓN DE DOCUMENTOS', 'https://res.cloudinary.com/dtjsttl1h/video/upload/v1737995471/7.GESTI%C3%93N_DE_DOCUMENTOS_hmcqdw.mp4', 7),
(1, 'EXCEPCIÓN PPC', 'https://res.cloudinary.com/dtjsttl1h/video/upload/v1737995433/8._EXCEPCI%C3%93N_PPC_y3cdus.mp4', 8),
(1, 'EXCEPCIÓN PPM', 'https://res.cloudinary.com/dtjsttl1h/video/upload/v1737995449/9._EXCEPCI%C3%93N_PPM_jul9dl.mp4', 9),
(1, 'PAGOS', 'https://res.cloudinary.com/dtjsttl1h/video/upload/v1737995454/10._PAGOS_gzluau.mp4', 10),
(1, 'DETALLE DE CUENTAS', 'https://res.cloudinary.com/dtjsttl1h/video/upload/v1737995448/11._DETALLE_DE_CUENTAS_cjzq86.mp4', 11);















CREATE OR ALTER PROCEDURE Asignar_Videos_Curso1
AS
BEGIN
    -- Variables para manejar IDs
    DECLARE @id_alumno INT;
    DECLARE @id_video INT;

    -- Tabla temporal para almacenar los alumnos con rol 'empleado'
    CREATE TABLE #Empleados (
        id INT
    );

    -- Tabla temporal para almacenar los videos del curso con id = 1
    CREATE TABLE #Videos (
        id INT
    );

    -- Insertar en la tabla temporal los IDs de alumnos con rol 'empleado'
    INSERT INTO #Empleados (id)
    SELECT id
    FROM Usuarios
    WHERE rol = 'empleado';

    -- Insertar en la tabla temporal los IDs de los videos del curso con id = 1
    INSERT INTO #Videos (id)
    SELECT id
    FROM Videos
    WHERE cursoId = 1;

    -- Iterar sobre cada empleado
    DECLARE empleados_cursor CURSOR FOR SELECT id FROM #Empleados;
    OPEN empleados_cursor;

    FETCH NEXT FROM empleados_cursor INTO @id_alumno;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Iterar sobre cada video del curso
        DECLARE videos_cursor CURSOR FOR SELECT id FROM #Videos;
        OPEN videos_cursor;

        FETCH NEXT FROM videos_cursor INTO @id_video;

        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Insertar en ProgresoVideo si no existe ya un registro similar
            IF NOT EXISTS (
                SELECT 1 
                FROM ProgresoVideo 
                WHERE alumnoId = @id_alumno AND videoId = @id_video
            )
            BEGIN
                INSERT INTO ProgresoVideo (alumnoId, videoId, estado, VideoVisto)
                VALUES (@id_alumno, @id_video, 0, 0);
            END;

            FETCH NEXT FROM videos_cursor INTO @id_video;
        END;

        -- Cerrar el cursor de videos
        CLOSE videos_cursor;
        DEALLOCATE videos_cursor;

        FETCH NEXT FROM empleados_cursor INTO @id_alumno;
    END;

    -- Cerrar el cursor de empleados
    CLOSE empleados_cursor;
    DEALLOCATE empleados_cursor;

    -- Eliminar las tablas temporales
    DROP TABLE #Empleados;
    DROP TABLE #Videos;
END;









UPDATE Usuarios
SET correo = 'admin', contraseña ='admin'
WHERE id = 3;

UPDATE Usuarios
SET correo = 'asesor1', contraseña ='asesor1'
WHERE id = 1;

UPDATE Usuarios
SET correo = 'asesor2', contraseña ='asesor2'
WHERE id = 2;

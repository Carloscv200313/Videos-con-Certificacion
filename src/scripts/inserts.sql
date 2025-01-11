INSERT INTO Usuarios (nombre, correo, contraseña, rol)
VALUES 
('Juan Pérez', 'juan', 'juan', 'empleado'),
('Ana López', 'ana', 'ana', 'empleado'),
('Carlos Calderon', 'carlos', 'carlos', 'gerente');
INSERT INTO Cursos (nombre, descripcion) VALUES
('Curso de Programación en Python', 'Aprende los fundamentos de Python'),
('Curso de Desarrollo Web', 'HTML, CSS y JavaScript desde cero'),
('Curso de Bases de Datos', 'Fundamentos de bases de datos relacionales');


INSERT INTO Videos (cursoId, titulo,link, orden) VALUES
(1, 'Introducción a Python',  '/video_11.mp4', 1),
(1, 'Estructuras de Control', '/video_12.mp4' , 2),
(1, 'Funciones en Python', '/video_13.mp4', 3),
(1, 'Programación Orientada a Objetos', '/video_14.mp4', 4),

-- Videos del Curso de Desarrollo Web (id=2)
(2, 'Introducción a HTML', '/video_21.mp4', 1),
(2, 'CSS Básico', '/video_22.mp4', 2),
(2, 'Introducción a JavaScript', '/video_23.mp4', 3),
(2, 'Proyecto Final: Página Web Completa', '/video_24.mp4', 4),

-- Videos del Curso de Bases de Datos (id=3)
(3, 'Introducción a las Bases de Datos', '/video_31.mp4',  1),
(3, 'SQL Básico',  '/video_32.mp4', 2),
(3, 'Normalización', '/video_33.mp4', 3),
(3, 'Conexión con Aplicaciones',  '/video_34.mp4',  4);

INSERT INTO Progresos (alumnoId, cursoId, progreso, examenHabilitado, notaFinal) VALUES
(1, 1, 0,  0, 0),
(1, 2, 0,  0, 0),
(1, 3, 0,  0, 0),
(2, 1, 0,  0, 0),
(2, 2, 0,  0, 0),
(2, 3, 0,  0, 0);


INSERT INTO ProgresoVideo (alumnoId, videoId, estado)
VALUES
    (1, 1, 0),
    (1, 2, 0),
    (1, 3, 0),
    (1, 4, 0),
	(1, 5, 0),
    (1, 6, 0),
    (1, 7, 0),
    (1, 8, 0),
    (1, 9, 0),
    (1, 10, 0),
    (1, 11, 0),
    (1, 12, 0),
    (2, 1, 0),
    (2, 2, 0),
    (2, 3, 0),
    (2, 4, 1),
	(2, 5, 0),
    (2, 6, 0),
    (2, 7, 0),
    (2, 8, 0),
    (2, 9, 0),
    (2, 10, 0),
    (2, 11, 0),
    (2, 12, 0);

UPDATE ProgresoVideo
        SET estado = 0
        WHERE videoId = 5;



SELECT 
    c.nombre AS Curso,
    p.estado AS Estado,
    v.id AS VideoId,
    v.cursoId AS CursoId,
    v.titulo AS Titulo,
    v.link AS Link,
    v.orden AS Orden
FROM 
    ProgresoVideo p
INNER JOIN 
    Usuarios u ON p.alumnoId = u.id
INNER JOIN 
    Videos v ON p.videoId = v.id -- Unión correcta entre ProgresoVideo y Videos
INNER JOIN 
    Cursos c ON v.cursoId = c.id
WHERE 
    c.id = 2  AND u.id=1;








		
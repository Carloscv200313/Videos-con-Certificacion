SELECT 
    id AS UsuarioId, 
    nombre AS NombreUsuario, 
    correo AS CorreoUsuario, 
    rol AS RolUsuario
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


ALTER TABLE Progresos
ADD Intentos INT ;

ALTER TABLE Progresos
DROP COLUMN examen3;
UPDATE Progresos
SET Intentos = 0;


SELECT * FROM ProgresoVideo

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
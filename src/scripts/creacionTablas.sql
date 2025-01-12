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
	cantidadVideos INT 
);

-- Creación de la tabla Videos
CREATE TABLE Videos (
    id INT PRIMARY KEY Identity(1,1),
    cursoId INT,
    titulo VARCHAR(100),
    link VARCHAR(255),
    orden INT,
    FOREIGN KEY (cursoId) REFERENCES Cursos(id)
);

CREATE TABLE Progresos (
    alumnoId INT,
    cursoId INT,
    progreso INT,
    examenHabilitado bit,
    notaFinal DECIMAL(5,2),
    PRIMARY KEY (alumnoId, cursoId), -- Cambiado el PK a alumnoId y cursoId
    FOREIGN KEY (alumnoId) REFERENCES Usuarios(id),
    FOREIGN KEY (cursoId) REFERENCES Cursos(id)
);


CREATE TABLE ProgresoVideo (
    alumnoId INT,
    videoId INT,
    estado BIT,
    PRIMARY KEY (alumnoId, videoId), -- Cambiado el PK a alumnoId y cursoId
    FOREIGN KEY (alumnoId) REFERENCES Usuarios(id),
    FOREIGN KEY (videoId) REFERENCES Videos(id)
);


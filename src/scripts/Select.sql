SELECT 
    id AS UsuarioId, 
    nombre AS NombreUsuario, 
    correo AS CorreoUsuario, 
    rol AS RolUsuario
FROM 
    Usuarios;


SELECT 
    id AS CursoId, 
    nombre AS NombreCurso, 
    descripcion AS DescripcionCurso,
	cantidadVideos
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
    alumnoId AS UsuarioId, 
    cursoId AS CursoId, 
    progreso AS ProgresoCurso, 
    examenHabilitado AS ExamenHabilitado, 
    notaFinal AS NotaFinalCurso
FROM 
    Progresos;



SELECT * FROM ProgresoVideo

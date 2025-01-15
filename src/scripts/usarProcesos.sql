EXEC Validar_usuario 'juan', 'juan';
EXEC cursosAlumnos @idUsuario='2';
EXEC ActivarCurso @idUsuario = 1, @idPrimerVideo = 1, @idCurso = 1;
EXEC ReiniciarCurso @idUsuario = 1, @idCurso = 3;
EXEC ObtenerVideos @idCurso = 1, @idUsuario = 1;
EXEC IdVideo @idCurso=1 , @idUsuario=1 , @idVideo=1
EXEC ActualizarSiguienteVideo @idCurso = 1, @idUsuario = 1, @idVideo = 1;


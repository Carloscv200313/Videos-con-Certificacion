EXEC Validar_usuario 'juan', 'juan';
EXEC cursosAlumnos @idUsuario='1';
EXEC ActivarCurso @idUsuario = 1, @idPrimerVideo = 1, @idCurso = 1;
EXEC ReiniciarCurso @idUsuario = 2, @idCurso = 4;
EXEC ObtenerVideos @idCurso = 1, @idUsuario = 1;
EXEC IdVideo @idCurso=1 , @idUsuario=1 , @idVideo=1
EXEC ActualizarSiguienteVideo @idCurso = 1, @idUsuario = 1, @idVideo = 1;
EXEC ObtenerProgresoCurso @CursoId = 1;
EXEC VideoTerminado @idCurso = 1, @idUsuario = 1, @idVideo = 1
EXEC CursoProgreso @idUsuario='2' , @idCurso = 1
EXEC ObtenerYActualizarProcesos @IdAlumno = 1, @IdCurso = 2;
EXEC ObtenerDatosProcesos @IdAlumno = 1;
EXEC Asignar_Videos_Curso1;


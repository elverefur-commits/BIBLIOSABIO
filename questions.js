const allQuestions = [
    // NIVEL 1: DEBUTANTE
    {
        question: "¿Cuál es el primer libro de la Biblia?",
        options: ["Éxodo", "Génesis", "Levítico", "Mateo"],
        answer: 1,
        difficulty: 1, // Debutante
        money: 100,
        source: "Fuente: Introducción General a la Biblia (Casa de la Biblia). El término Génesis significa 'origen'."
    },
    {
        question: "¿Quién construyó el arca para sobrevivir al diluvio?",
        options: ["Adán", "Abraham", "Noé", "Moisés"],
        answer: 2,
        difficulty: 1,
        money: 200,
        source: "Fuente: Génesis 6-9. Narrativa patriarcal."
    },
    {
        question: "¿A qué ciudad se dirigía Pablo cuando experimentó su conversión?",
        options: ["Jerusalén", "Roma", "Damasco", "Antioquía"],
        answer: 2,
        difficulty: 1,
        money: 300,
        source: "Fuente: Hechos de los Apóstoles 9. Evento central de la vocación paulina."
    },
    {
        question: "¿Cuántos evangelios conforman el Nuevo Testamento?",
        options: ["Dos", "Tres", "Cuatro", "Cinco"],
        answer: 2,
        difficulty: 1,
        money: 500,
        source: "Fuente: Introducción al Nuevo Testamento. (Mateo, Marcos, Lucas y Juan)."
    },
    {
        question: "¿Quién es conocido como el 'Rey Poeta' y se le atribuyen la mayoría de los Salmos?",
        options: ["Salomón", "David", "Saúl", "Ezequías"],
        answer: 1,
        difficulty: 1,
        money: 1000,
        isSafeHaven: true,
        source: "Fuente: Libros Históricos y Sapienciales. La tradición judía y cristiana atribuye gran parte del Salterio a David."
    },

    // NIVEL 2: INTERMEDIO
    {
        question: "¿Qué significa la palabra 'Pentateuco'?",
        options: ["Cinco rollos o libros", "Leyes sagradas", "Antigua Alianza", "Profecías mayores"],
        answer: 0,
        difficulty: 2, // Intermedio
        money: 2000,
        source: "Fuente: Introducción al AT. Proviene del griego 'penta' (cinco) y 'teuchos' (estuches/rollos)."
    },
    {
        question: "¿Cuál de estos NO es considerado un Evangelio Sinóptico?",
        options: ["Mateo", "Marcos", "Lucas", "Juan"],
        answer: 3,
        difficulty: 2,
        money: 4000,
        source: "Fuente: Problema Sinóptico. Juan tiene una tradición, estructura y teología distintas a los otros tres."
    },
    {
        question: "Según la Teología Bíblica, ¿qué término hebreo se traduce como 'Aliento', 'Viento' o 'Espíritu'?",
        options: ["Nephesh", "Ruah", "Basar", "Sheol"],
        answer: 1,
        difficulty: 2,
        money: 8000,
        source: "Fuente: Antropología Teológica del AT. 'Ruah' denota la fuerza vital que proviene de Dios."
    },
    {
        question: "¿En qué idioma fue escrito originalmente la mayor parte del Nuevo Testamento?",
        options: ["Hebreo", "Arameo", "Latín", "Griego Koiné"],
        answer: 3,
        difficulty: 2,
        money: 16000,
        source: "Fuente: Introducción al NT. El griego 'koiné' era la lengua franca del Imperio Romano oriental."
    },
    {
        question: "¿Qué profeta del Antiguo Testamento tiene la visión del 'valle de los huesos secos'?",
        options: ["Isaías", "Jeremías", "Ezequiel", "Daniel"],
        answer: 2,
        difficulty: 2,
        money: 32000,
        isSafeHaven: true,
        source: "Fuente: Libro de Ezequiel 37. Representa la promesa de restauración del pueblo de Israel."
    },

    // NIVEL 3: AVANZADO
    {
        question: "¿Qué documento del Concilio Vaticano II es la constitución dogmática sobre la Divina Revelación?",
        options: ["Lumen Gentium", "Dei Verbum", "Gaudium et Spes", "Sacrosanctum Concilium"],
        answer: 1,
        difficulty: 3, // Avanzado
        money: 64000,
        source: "Fuente: Documentos del Concilio Vaticano II. 'Dei Verbum' (Palabra de Dios) aborda la Sagrada Escritura y la Tradición."
    },
    {
        question: "En la crítica literaria (Hipótesis Documentaria), ¿cuál tradición se caracteriza por usar el nombre 'Yahvé' desde el principio?",
        options: ["Tradición Elohísta (E)", "Tradición Yahvista (J)", "Tradición Sacerdotal (P)", "Tradición Deuteronomista (D)"],
        answer: 1,
        difficulty: 3,
        money: 125000,
        source: "Fuente: Introducción al Pentateuco. La fuente 'J' es de las más antiguas, originada en el sur (Judá)."
    },
    {
        question: "El concepto de 'Sitz im Leben' utilizado en la exégesis bíblica, ¿a qué se refiere?",
        options: ["Al género literario del texto", "Al contexto o 'situación vital' de la comunidad donde surgió", "A la traducción original al griego", "Al autor histórico del texto"],
        answer: 1,
        difficulty: 3,
        money: 250000,
        source: "Fuente: Crítica de las Formas (Formgeschichte). Hermann Gunkel lo introdujo para entender la función social del texto."
    },
    {
        question: "¿Cuál fue el principal criterio de la Iglesia primitiva para aceptar un libro en el canon del Nuevo Testamento?",
        options: ["Origen apostólico (Apostolicidad)", "Estar escrito en arameo", "Haber sido encontrado en Jerusalén", "Tener más de 20 capítulos"],
        answer: 0,
        difficulty: 3,
        money: 500000,
        source: "Fuente: Formación del Canon del NT. Los criterios eran la apostolicidad, la ortodoxia y el uso litúrgico generalizado."
    },
    {
        question: "En los escritos paulinos, el término griego 'Dikaiosyne' es fundamental. ¿Cómo se traduce comúnmente en la teología dogmática?",
        options: ["Misericordia", "Paz", "Justificación / Justicia", "Gracia"],
        answer: 2,
        difficulty: 3,
        money: 1000000,
        isSafeHaven: true,
        source: "Fuente: Teología Paulina (Romanos y Gálatas). La justificación por la fe es el núcleo de su argumentación."
    },

    // NIVEL 4: SUPERIOR
    {
        question: "¿Qué término técnico designa a los textos bíblicos que relatan los orígenes del mundo en Génesis 1-11?",
        options: ["Historia Deuteronomista", "Historia Primitiva / Orígenes", "Literatura Apocalíptica", "Hagadá Rabínica"],
        answer: 1,
        difficulty: 4, // Superior
        money: 1500000,
        source: "Fuente: Comentario al Pentateuco. (Urgeschichte en alemán) Trata mitos etiológicos adaptados a la fe yahvista."
    },
    {
        question: "En la crítica textual del NT, el Papiro P52 (Fragmento de Rylands) es famoso porque...",
        options: ["Es el manuscrito completo más antiguo", "Contiene el evangelio perdido de Tomás", "Es el fragmento más antiguo conservado del Evangelio de Juan (aprox. 125 d.C.)", "Demuestra que Marcos se escribió en latín"],
        answer: 2,
        difficulty: 4,
        money: 2000000,
        source: "Fuente: Paleografía y Crítica Textual del NT. P52 se encontró en Egipto y refutó las dataciones tardías de Juan."
    },
    {
        question: "¿A qué género literario pertenecen principalmente libros como Daniel y el Apocalipsis, caracterizados por el uso intenso de simbolismo y visiones escatológicas?",
        options: ["Literatura Sapiencial", "Literatura Profética pre-exílica", "Literatura Apocalíptica", "Literatura Midrásica"],
        answer: 2,
        difficulty: 4,
        money: 3000000,
        source: "Fuente: Introducción a la Literatura Apocalíptica. Surge en tiempos de crisis y persecución para dar esperanza."
    },
    {
        question: "El documento Q (de Quelle) es una fuente hipotética utilizada para explicar...",
        options: ["El material común de Mateo y Lucas ausente en Marcos", "Las cartas auténticas de Pablo", "El origen del Evangelio de Juan", "La traducción de la Septuaginta"],
        answer: 0,
        difficulty: 4,
        money: 4000000,
        source: "Fuente: El Problema Sinóptico (Teoría de las dos fuentes). 'Q' habría sido una colección de dichos (logia) de Jesús."
    },
    {
        question: "En la interpretación bíblica católica recomendada por la Pontificia Comisión Bíblica (1993), ¿qué método es considerado el 'indispensable' para el estudio científico?",
        options: ["El método histórico-crítico", "El fundamentalismo", "La lectura psicoanalítica", "La lectura estructuralista"],
        answer: 0,
        difficulty: 4,
        money: 5000000,
        isSafeHaven: true,
        source: "Fuente: Documento 'La Interpretación de la Biblia en la Iglesia' (PCB 1993). Es el método diacrónico por excelencia."
    },

    // NIVEL 5: EXPERTO
    {
        question: "Dentro de la crítica textual del AT, ¿qué nombre recibe la edición crítica estándar de la Biblia Hebrea utilizada hoy en día por los exégetas?",
        options: ["Biblia Vulgata Clementina", "Novum Testamentum Graece (Nestle-Aland)", "Biblia Hebraica Stuttgartensia (BHS)", "Textus Receptus"],
        answer: 2,
        difficulty: 5, // Experto
        money: 6000000,
        source: "Fuente: Crítica Textual del AT. La BHS está basada en el Códice de Leningrado (B19a)."
    },
    {
        question: "En la exégesis del Evangelio de Juan, R. Bultmann propuso la existencia de tres fuentes principales. ¿Cuál es la que habría contenido los milagros?",
        options: ["Fuente de los Signos (Semeia-Quelle)", "Discursos de Revelación", "Pasión", "Fuente Q"],
        answer: 0,
        difficulty: 5,
        money: 7000000,
        source: "Fuente: Exégesis Joanica (Bultmann, Brown). La 'Semeia' explicaba los 7 grandes signos (milagros) en Juan."
    },
    {
        question: "Según el análisis retórico de las epístolas paulinas (G. Kennedy), Romanos es considerada mayormente...",
        options: ["Retórica Deliberativa", "Retórica Epidíctica", "Retórica Forense", "Retórica Apologética"],
        answer: 0,
        difficulty: 5,
        money: 8000000,
        source: "Fuente: Crítica Retórica del NT. Pablo persuade (deliberativa) a los romanos sobre la justificación universal."
    },
    {
        question: "El término 'Targum' en el contexto bíblico se refiere a:",
        options: ["Un rollo original en hebreo encontrado en Qumrán", "La traducción al latín hecha por San Jerónimo", "Una traducción y explicación aramea de la Biblia hebrea leída en la sinagoga", "Un comentario patrístico antiguo"],
        answer: 2,
        difficulty: 5,
        money: 9000000,
        source: "Fuente: Judaísmo Intertestamentario y Rabínico. Los tárgumes (ej. Onkelos) ayudan a entender la hermenéutica judía."
    },
    {
        question: "En Cristología Bíblica, el título 'Hijo del Hombre' (Ben Adam / Bar Enash) adquiere su mayor profundidad escatológica en el AT a partir de qué pasaje específico?",
        options: ["Génesis 3,15 (Protoevangelio)", "Daniel 7,13-14", "Isaías 53 (Siervo Sufriente)", "Salmo 2 (Entronización)"],
        answer: 1,
        difficulty: 5,
        money: 10000000,
        isSafeHaven: true,
        source: "Fuente: Teología del NT. En Daniel 7, el 'hijo de hombre' recibe dominio eterno del Anciano de Días."
    }
];

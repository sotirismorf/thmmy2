const pool = require('../db')

exports.getDownloads = async (req, res) => {
  const { course } = req.params

  try {
    const courseID = await pool.query(
      'SELECT id FROM courses WHERE code_name=$1',
      [course]
    )

    if (courseID.rowCount == 0) {
      return res
        .status(404)
        .send({ message: `Error: No course with name ${course}` })
    }

    const data = await pool.query('SELECT * FROM files WHERE course=$1', [
      courseID.rows[0].id,
    ])

    res.status(200).json(data.rows)
  } catch (err) {
    console.error(err.message)
    //res.status(501).send({ message: err.message });
  }
}

exports.getCourses = async (req, res) => {
  const { cycle, semester } = req.params

  try {
    const data = await pool.query(
      'SELECT * FROM courses WHERE study_cycle=$1 AND semester=$2',
      [cycle, semester]
    )

    res.status(200).json({
      breadcrumb: [
        {
          title: 'Βασικός κύκλος σπουδών',
          codename: 'vasikos',
          href: 'vasikos',
        },
        {
          title: `${semester}ο εξάμηνο`,
          codename: semester,
          href: `vasikos/${semester}`,
        },
      ],
      courses: data.rows,
    })
  } catch (err) {
    console.error(err.message)
    //res.status(501).send({ message: err.message });
  }
}

exports.newUpload = async (req, res) => {
  const {
    author,
    filename,
    filetype,
    description,
    detail,
    course,
    year,
    isExam,
    examSemester,
    hasSolutions,
  } = JSON.parse(req.body.document)

  try {
    if (!req.files) {
      res.send({
        //status: false,
        message: 'No file uploaded',
      })
    } else {
      const fileData = await pool.query(
        'INSERT INTO files \
        (id,author,name,filetype,description,detail,course,year,is_exam,exam_semester,has_solutions) \
        VALUES (default,$1,$2,$3,$4,$5,$6,$7,$8,$9,$10) \
        RETURNING *',
        [
          author,
          filename,
          filetype,
          description,
          detail,
          course,
          year,
          isExam,
          examSemester,
          hasSolutions,
        ]
      )

      let file = req.files.file;

      file.mv(`/home/sotiris/thmmyrepository/${fileData.rows[0].id}.${filetype}`)
      res.send({ message: 'File Uploaded' })
    }
  } catch (err) {
    //res.status(200).json(data.rows)
    console.error(err.message)
    res.status(501).send({ message: err.message })
    //res.status(501).sendStatus({ message: err.message })
  }
}

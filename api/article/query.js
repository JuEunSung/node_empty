class ArticleQuery {
  selectArticleListCount(params) {
    const q = `
      SELECT
        COUNT(a.a_no) AS count
      FROM
        tbl_article AS a
        INNER JOIN tbl_member AS m
        ON m.m_no = a.m_no
        LEFT JOIN tbl_stock AS s
        ON s.s_no = a.s_no
        LEFT JOIN tbl_article_report AS ar
        ON ar.a_no = a.a_no AND ar.m_no = :m_no
      WHERE
        a.a_is_delete = 'N'
        AND a.a_is_report = 'N'
        AND ar.ar_reg_dt IS NULL
        ${params.s_code !== '*ALL*' && !params.s_code ? 'AND a.s_no IS NULL' : ''}
        ${params.s_code !== '*ALL*' && params.s_code ? 'AND s.s_code = :s_code' : ''}
        ${params.keyword ? "AND (a.a_title LIKE CONCAT('%', :keyword,'%') OR m.m_name LIKE CONCAT('%', :keyword,'%'))" : ''}
        ${params.profile ? 'AND m.m_no = :profile' : ''}
    `;

    return q;
  }

  selectArticleList(params) {
    const q = `
      SELECT
        a.a_no
        ,a.a_title
        ,DATE_FORMAT(a.a_reg_dt, '%Y.%m.%d') AS a_reg_dt
        ,m.m_name
        ,CONCAT(:STATIC_URL, '/', REPLACE(REPLACE(SUBSTR(f.f_stored_path, INSTR(f.f_stored_path, 'users')), '\\\\', '/'), f.f_stored_name, CONCAT('thumb-', f.f_stored_name))) AS profile
        ,IF(m.m_no = :m_no, 'Y', 'N') AS is_mine
        ,
        (
          SELECT COUNT(ms_no)
          FROM tbl_member_subscription
          WHERE ms_to_m_no = a.m_no
        ) AS subscription_count
        ,IF(a.a_reg_dt > DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00'), 'Y', 'N') AS is_today
        ,s.s_name
      FROM
        tbl_article AS a
        INNER JOIN tbl_member AS m
        ON m.m_no = a.m_no
        LEFT JOIN tbl_stock AS s
        ON s.s_no = a.s_no
        LEFT JOIN tbl_file AS f
        ON f.f_no = m.f_profile
        LEFT JOIN tbl_article_report AS ar
        ON ar.a_no = a.a_no AND ar.m_no = :m_no
      WHERE
        a.a_is_delete = 'N'
        AND a.a_is_report = 'N'
        AND ar.ar_reg_dt IS NULL
        ${params.s_code !== '*ALL*' && !params.s_code ? 'AND a.s_no IS NULL' : ''}
        ${params.s_code !== '*ALL*' && params.s_code ? 'AND s.s_code = :s_code' : ''}
        ${params.keyword ? "AND (a.a_title LIKE CONCAT('%', :keyword,'%') OR m.m_name LIKE CONCAT('%', :keyword,'%'))" : ''}
        ${params.profile ? 'AND m.m_no = :profile' : ''}
      ORDER BY
        a.a_reg_dt DESC
      LIMIT
        :startRow, :rowPerPage
    `;

    return q;
  }
}

module.exports = new ArticleQuery();

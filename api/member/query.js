class MemberQuery {
  selectMemberProfile() {
    const q = `
      SELECT
        m.m_id
        ,m.m_is_sns
        ,m.m_sns_type
        ,m.m_name
        ,m.m_is_push
        ,CONCAT(:STATIC_URL, '/', REPLACE(REPLACE(SUBSTR(f.f_stored_path, INSTR(f.f_stored_path, 'users')), '\\\\', '/'), f.f_stored_name, CONCAT('thumb-', f.f_stored_name))) AS profile
        ,IF(:m_no = :profile, 'Y', 'N') AS is_mine
        ,
        (
          SELECT COUNT(ms_no)
          FROM tbl_member_subscription
          WHERE ms_to_m_no = m.m_no
        ) AS subscription_count
        ,
        (
          SELECT IF(COUNT(ms_no) > 0, 'Y', 'N')
          FROM tbl_member_subscription
          WHERE ms_to_m_no = m.m_no AND ms_from_m_no = :m_no
        ) AS is_subscription
        ,cc.cc_value AS m_grade
      FROM
        tbl_member AS m
        LEFT JOIN tbl_file AS f
        ON f.f_no = m.f_profile
        LEFT JOIN tbl_common_code AS cc
        ON cc.cc_code = m.cc_grade
      WHERE
        m.m_no = :profile
    `;

    return q;
  }
}

module.exports = new MemberQuery();

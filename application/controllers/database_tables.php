<?php
class Database_tables extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->database();
        $query = $this->db->query('CREATE TABLE IF NOT EXISTS `bees` (`id` bigint(20) NOT NULL AUTO_INCREMENT,`hive_id` bigint(20) NOT NULL,`type` enum("queen","worker","drone") CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,PRIMARY KEY (`id`),KEY `hive_id` (`hive_id`)) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1');
        $query->result();
        $query = $this->db->query('CREATE TABLE IF NOT EXISTS `hive` (`id` bigint(20) NOT NULL AUTO_INCREMENT,`name` varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,PRIMARY KEY (`id`)) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=1');
        $query->result();
    }
}
?>

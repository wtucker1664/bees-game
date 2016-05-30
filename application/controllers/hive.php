<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Hive extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -  
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in 
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see http://codeigniter.com/user_guide/general/urls.html
	 */
        public function __construct() {
            parent::__construct();
            $this->load->helper(array('url','form'));
            $this->load->database();
        }
	public function index()
	{
                $query = $this->db->query("SELECT * FROM hives");
                $rows = $query->result();
                $data['heading'] = 'Choose a Hive to Play in';
                $this->load->view('hive_header',$data);
                
                for($i=0;$i<sizeof($rows);$i++){
                	if(!isset($rows[$i]->hits)){
                		$rows[$i]->hits = 0;
                	}
                    $this->load->view('hive_option',$rows[$i]);
                }
		$this->load->view('hive_footer');
	}
        public function play(){
            $hive_id = $this->input->get('id');
            $query = $this->db->query("SELECT * FROM bees where hive_id=".$hive_id);
                $rows = $query->result();
                $data['heading'] = 'Hit the bees';
                $data['hive_id'] = $hive_id;
                $this->load->view('hive_header',$data);
                for($i=0;$i<sizeof($rows);$i++){
                    $this->load->view('hive_bees',$rows[$i]);
                }
            $this->load->view('hive_hit_bees',$data);
            $this->load->view('hive_footer');
        }
        public function hitBee(){
            $data = $this->input->post();
            
            $query = $this->db->query("SELECT count(*) as `count` FROM bees where hive_id=".$data['hive_id']);
            $count = $query->row();
            
            $query = $this->db->query("SELECT * FROM bees where hive_id=".$data['hive_id']);
            $bees = $query->result();
            $num = rand(0,($count->count-1));
            
            $bee = $bees[$num];
            if($bee->type == 'drone'){
                $bee->hits -= 12;
                if($bee->hits < 0){
                	$bee->hits = 0;
                }
            }
            if($bee->type == 'queen'){
                $bee->hits -= 8;
                if($bee->hits < 0){
                	$bee->hits = 0;
                }
            }
            if($bee->type == 'worker'){
                $bee->hits -= 10;
                if($bee->hits < 0){
                	$bee->hits = 0;
                }
            }
            $this->db->update('bees',  $bee,array('id'=>$bee->id));
            $data1['saveSuccessful'] = true;
            
            echo json_encode($data1);
            exit();
           
        }
        
        public function reset(){
        	 $data = $this->input->post();
        	
        	$query = $this->db->query("SELECT * FROM bees where hive_id=".$data['hive_id']);
                $bees = $query->result();
                
             for($i=0;$i<sizeof($bees);$i++){
             	$bees[$i]->hits =0;
             	
            if($bees[$i]->type == 'queen'){
                
                	$bees[$i]->hits = 100;
                
            }
            
            if($bees[$i]->type == 'drone'){
                
                	$bees[$i]->hits = 50;
                
            }
            
            if($bees[$i]->type == 'worker'){
                
                	$bees[$i]->hits = 75;
                
            }
            
             	$this->db->update('bees',  $bees[$i],array('id'=>$bees[$i]->id));
             }   
        	$data1['saveSuccessful'] = true;
            
            echo json_encode($data1);
            exit();
        }
        
}

/* End of file welcome.php */
/* Location: ./application/controllers/welcome.php */
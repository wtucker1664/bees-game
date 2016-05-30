<script src="<?php print base_url();?>application/third_party/js/jquery-1.7.1.min.js"></script>
        <script src="<?php print base_url();?>application/third_party/js/jquery-ui-1.8.17.custom.min.js"></script>
        <script src="<?php print base_url();?>application/third_party/js/formValidation/jquery.formValidation.js"></script> 
<script>

            $(document).ready(function(){
                $('#hit_bee').formValidation({
                    url:'<?php print site_url("hive/hitBee");?>',
                    butSaveId:'#bee-button',
                    dialogId:'#bee-dialog',
                    iframeId:'#bee-iframe',
                    showBeforeSend:false,
                    showSaveComplete:false,
                    callBackSuccess:function(){
                    	location.reload();
                    }
                });
                
				$('#hit_bee').formValidation({
                    url:'<?php print site_url("hive/reset");?>',
                    butSaveId:'#bee-reset',
                    dialogId:'#bee-dialog',
                    iframeId:'#bee-iframe',
                    showBeforeSend:false,
                    showSaveComplete:false,
                    callBackSuccess:function(){
                    	location.reload();
                    }
                });
            });


        </script>
        <?php
                $attributes = array('name' => 'hit_bee', 'id' => 'hit_bee');

                echo form_open_multipart("hive/hitBee", $attributes);
                
                echo form_hidden('hive_id', $hive_id);
               
            ?>
        </form>
        <button id="bee-button">Bit Bee</button>
        <button id="bee-reset">Reset</button>
        <div id="bee-dialog" style="display:none"></div>
<iframe name="bee-iframe" id="bee-iframe" style="display:none"></iframe>
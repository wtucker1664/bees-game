/*
 *  @author warren.tucker
 */

(function($){
    $.fn.extend({
        formValidation: function(options){

            options = $.extend({}, $.formValidations.defaults, {}, options);
            return this.each(function() {
                new $.formValidations(this, options);
            });
        }
    });

    $.formValidations = function(obj,options){
        var appendIframeAndDialogId = typeof options.appendIframeAndDialogId != 'undefined' ? $(options.appendIframeAndDialogId) : '';
        if(typeof(appendIframeAndDialogId) == 'object'){
            
        }
        var tabsId = typeof options.tabsId != 'undefined' ? options.tabsId : '#tabs-main';
        var formObj = typeof options.formId != 'undefined' ? $(options.formId) : $(obj);
        var iframe = typeof options.iframeId != 'undefined' ? options.iframeId : '';
        var dialogObj = typeof options.dialogId != 'undefined' ? $(options.dialogId) : alert('Please supply a dialog Id');
        if(typeof(dialogObj) != 'object'){
            alert('No dialog');
        }
        var removeDialog = typeof options.removeDialog != 'undefined' ? options.removeDialog : false;
        var formChanged = false;
        var beforeSend = typeof options.beforeSend != 'undefined' ? options.beforeSend : '<p>Saving...</p>';
        var showBeforeSend = typeof options.showBeforeSend != 'undefined' ? options.showBeforeSend : true;
        var showSaveComplete = typeof options.showSaveComplete != 'undefined' ? options.showSaveComplete : true;
        var saveComplete = typeof options.saveComplete != 'undefined' ? options.saveComplete : '<p>Save Successful</p>';
        var saveTitle = typeof options.saveTitle != 'undefined' ? options.saveTitle : 'Save Information';
        var overrideDialogMessage = typeof options.overrideDialogMessage != 'undefined' ? options.overrideDialogMessage : false;
        var replaceValue = typeof options.replaceValue != 'undefined' ? options.replaceValue : '';
        var placeHolder = typeof options.placeHolder != 'undefined' ? options.placeHolder : '';
        var id = typeof options.id != 'undefined' ? options.id : null;
        var butSaveObj = typeof(options.butSaveId) != 'undefined' ? $(options.butSaveId) : $(obj);
     
        var ckeditor = typeof options.ckeditor != 'undefined' ? options.ckeditor : 'POST';
        var iframeObj = typeof options.iframeId != 'undefined'? $(options.iframeId) : alert('Please supply a frame Id');
        var urlSend = typeof options.url != 'undefined'? options.url : alert('Please supply a url to save the data');
        var showFrameContent = false;
        var formMethod = typeof options.type != 'undefined' ? options.type : 'POST';
        var uploadFile = typeof options.upLoadFile != 'undefined' ? options.upLoadFile : false;
        var debug = typeof options.debug != 'undefined' ? options.debug : false;
        var formDataBefore = {};
        var clickOnSave = false;
        var action = null;
        var butId = null;
        var butName = null;
        var butType = null;
        var tabs_main = null;
        var butUrl = null;
        
        setFormonChange();
        if(typeof(options.gridSelect) != 'undefined'){
            var gridSelect = options.gridSelect;
            var gridId = options.gridId;
        }

        if(typeof options.actionButtons == 'object'){
            $.each(options.actionButtons,function(k,v){
                $(v.id).click(function(event){
                    ie8SafePreventEvent(event);
                        var formData = {};
                        $.each(formObj.find(':input').find(':checkbox').find(':radio').find('select'),function(k,v){

                            if($(v).attr('name') && $(v).attr('type') != 'hidden'){
                                var name = $(v).attr('name');
                                formData[name] = $(v).val() ;


                            }
                        });

                       var tabs_main_idx_cur = $(tabsId).tabs('option', 'selected');
                       var length = $(tabsId).tabs( "length" );
                       if(k.toString() == 'next'){

                           tabs_main = tabs_main_idx_cur + 1;

                       }else if(k.toString() == 'back'){
                           tabs_main = tabs_main_idx_cur - 1;
                       }
                       if(tabs_main > length){
                           tabs_main = length;
                       }else if(tabs_main < 0){
                           tabs_main = 0;
                       }
                       if(formChanged){
                           butType = k.toString();
                           action = v.action;
                            butUrl = v.url;
                            butId = v.id;
                            butName = v.name;
                           //$('.ui-widget-overlay').remove();
						   
							dialogObj.dialog('destroy');
							dialogObj.html('<p>Save changes before continuing?</p>');
							dialogObj.dialog({
								modal:true,
								title:'Attention',
								buttons:{
									'Cancel':function(){
										dialogObj.dialog('destroy');
									},
									'No':function(){
										dialogObj.dialog('destroy');
										if(k.toString() == 'next' || k.toString() == 'back'){

											$(tabsId).tabs('select',tabs_main);
										}else if(typeof v.url != 'undefined'){
											$(tabsId).tabs('url',$(tabsId).tabs('option', 'selected'),v.url);
											$(tabsId).tabs('load',$(tabsId).tabs('option', 'selected'));
										}

									},
									'Yes':function(){
										clickOnSave = true;
									   // formDataBefore = formData;

										butSaveObj.trigger('click');

									}
								}
							});
							
							return false;
						}



                    if(typeof(v.action) == 'function'){
                        v.action();
                    }else{
                        if(k.toString() == 'next' || k.toString() == 'back'){
                            $(tabsId).tabs('select',tabs_main);
                        }else if(typeof v.url != 'undefined'){

                            $(tabsId).tabs('url',$(tabsId).tabs('option', 'selected'),v.url);
                            $(tabsId).tabs('load',$(tabsId).tabs('option', 'selected'));
                        }
                    }
                    dialogObj.dialog('destroy');
                   });
            });
        }

        if(iframe != ''){
            var iframeT = null;
            iframeObj = $(iframe);
            formObj.attr('action',options.url);
            iframeT = iframe.split('#');
            formObj.attr('target',iframeT[1]);
            
            if(uploadFile === true){
                if(!formObj.attr('enctype')){
                    //alert('Plese set the enctype attribute to the form to use file uploads');
                    formObj.attr('enctype','multipart/form-data');
                }
            }

            formObj.attr('method',formMethod);

            iframeObj.load(function(){


                if(showFrameContent){

                    var iframeContent = iframeObj.contents().find('body').html();

                    if(debug){
                        $('.ui-widget-overlay').remove();
                        dialogObj.dialog('destroy');
                        dialogObj.html(iframeObj.contents().find('body').html());
                        dialogObj.dialog({

                                modal:true,
                                title:'Debug Mode',
                                buttons:{
                                    'OK':function(){
                                        dialogObj.dialog('destroy');
                                        if(removeDialog){
                                            dialogObj.remove();
                                        }
                                    }
                                }
                            });
                    }else{


                        eval("var data ="+ iframeContent+';');
                        if(typeof data != 'object'){
                            var data = (new Function("return " + iframeContent+';'))()
                        }
                        if(typeof(data.redirect) =="string"){ document.location.href = data.redirect; }
                        if(data.saveSuccessful){
                            removeFieldHighlights();
                            if(overrideDialogMessage){
                                var k = "data."+replaceValue;
                                var v = eval(k);
                                saveComplete = saveComplete.replace(placeHolder,v);
                            }
                            $('.ui-widget-overlay').remove();
                            if(showSaveComplete){							
								dialogObj.dialog('destroy');
								dialogObj.html(saveComplete);
								dialogObj.dialog({

									modal:true,
									title:saveTitle,
									buttons:{
										'OK':function(){

											typeof options.callBackSuccess == 'function' ? options.callBackSuccess(data,dialogObj) : '';

											dialogObj.dialog('destroy');

										}
									}
								});
                            }else{
                                typeof options.callBackSuccess == 'function' ? options.callBackSuccess(data,dialogObj) : '';
                                dialogObj.dialog('destroy');
                            }
                            if(removeDialog){
                                dialogObj.remove();
                            }
                        }else{
                            $('.ui-widget-overlay').remove();
                            dialogObj.dialog('destroy');
                            dialogObj.html('<p>There are errors on the form.</p><p>Please check and try again.</p>');
                            dialogObj.dialog({
                                modal:true,
                                title:'Error',
                                buttons:{
                                    'OK':function(){
                                        removeFieldHighlights();

                                        if(typeof data.errors != 'undefined'){
                                            var errors = new Array();
                                            var m=0;
                                            var errObj = data.errors;

                                                for(var i in errObj){
                                                    if(errObj[i].name == 'database' || errObj[i].name == 'userMessage'){
                                                       
                                                        errors[m] = errObj[i];
                                                        m++;
                                                    }
                                                }
                                                processErrors(errObj);
                                                setTimeout(function(){
                                                        cycleDialogs(errors,0,dialogObj);
                                                },500);
                                                

                                            }


                                        dialogObj.dialog('destroy');
                                    }
                                }
                            });
                        }

                    }
                }
            });
        }

    function processErrors(errObj){
        $('.ui-widget-overlay').remove();
        
        $.each(formObj.find(':input'),function(k,v){
           
            for(var i in errObj){
                
                if($(v).is(':input') && $(v).not(':checkbox').not(':radio').not('select')){
                    
                    if($(v).attr('name') == errObj[i].name && $(v).attr('type') != 'hidden' ){

                            var message = errObj[i].message;
                            if($(v).parent().parent().parent().is('ul')){
                                $(v).parent().parent().parent().parent().addClass(options.errorClass);
                            }else{
                                $(v).parent().parent().addClass(options.errorClass);
                            }


                                $(v).parent().after('<span class="ui-icon ui-icon-alert fv-icon-error"></span>');


                            $(v).parent().parent().find('span').click(function(){

                                    dialogObj.dialog('destroy');
                                    dialogObj.html(message);
                                    dialogObj.dialog({
                                    modal:true,
                                    title:'Error Information',
                                    buttons:{
                                        'OK':function(){
                                            $(this).dialog('destroy');
                                            }
                                        }

                                    });

                                });
                           
                        }
                }else if($(v).is(':checkbox')){
                    if($(v).attr('name') == errObj[i].name && $(v+':not(:checked)') ){
                         var message = errObj[i].message;
                         if($(v).parent().parent().parent().is('ul')){
                                $(v).parent().parent().parent().parent().addClass(options.errorClass);
                            }else{
                                $(v).parent().parent().addClass(options.errorClass);
                            }





                            $(v).parent().after('<span class="ui-icon ui-icon-alert fv-icon-error" ></span>');
                            $(v).parent().parent().find('span').click(function(){
                                    dialogObj.dialog('destroy');
                                    dialogObj.html(message);
                                    dialogObj.dialog({
                                    modal:true,
                                    title:'Error Information',
                                    buttons:{
                                        'OK':function(){
                                            dialogObj.dialog('destroy');
                                            }

                                        }
                                    });
                               });
                    }
                }else if($(v).is(':radio')){
                    if($(v).attr('name') == errObj[i].name && $(v+':not(:checked)') ){
                         var message = errObj[i].message;
                         if($(v).parent().parent().parent().is('ul')){
                                $(v).parent().parent().parent().parent().addClass(options.errorClass);
                            }else{
                                $(v).parent().parent().addClass(options.errorClass);
                            }




                            $(v).parent().after('<span class="ui-icon ui-icon-alert fv-icon-error" ></span>');
                            $(v).parent().parent().find('span').click(function(){
                                    dialogObj.dialog('destroy');
                                    dialogObj.html(message);
                                    dialogObj.dialog({
                                    modal:true,
                                    title:'Error Information',
                                    buttons:{
                                        'OK':function(){
                                            dialogObj.dialog('destroy');
                                            }
                                        }

                                    });
                               });
                    }


                    }
                }
            });     

            
    

        }


        function ie8SafePreventEvent(e){
            if(e.preventDefault){
                e.preventDefault()
            }else{
                e.stop()
            };

            e.returnValue = false;
            e.stopPropagation();
        }

        if(typeof(butSaveObj) == 'object'){
            butSaveObj.unbind('click');
            butSaveObj.click(function(event){
                typeof options.callBackBeforeSubmit == 'function' ? options.callBackBeforeSubmit() : '';
                ie8SafePreventEvent(event);
                var formData = {};

                $.each(formObj.find('*'),function(k,v){
                    if($(v).attr('name') && !$(v).attr('disabled')){
                        var x = 0;
                        var noCKEditor= true;

                        if(typeof ckeditor[x] == 'object'){
                            $.each(ckeditor,function(k1,v1){
                                if($(v).attr('name') == ckeditor[k1].name){
                                   var name = ckeditor[k1].name;
                                   formData[name] = (new Function("return " + ckeditor[k1].instance))() ;
                                   noCKEditor = false;
                                }
                            });
                            x++;
                        }

                        if(noCKEditor){
                            if($(v).attr('type') == 'checkbox'){
                                if($(v).attr('checked') || $(v).attr('checked') == 'checked'){

                                    var name = $(v).attr('name');
                                    formData[name] = $(v).val() ;
                                }
                            }else if($(v).attr('type') == 'radio'){
                                if($(v).attr('checked') || $(v).attr('checked') == 'checked'){

                                    var name = $(v).attr('name');
                                    formData[name] = $(v).val() ;
                                }
                            }else if($(v).attr('multiple')){

                                var vals = $(v).val()
                                var vSize = 0;
                                if(vals != null){
                                    vSize = vals.length;
                                }
                                for(var i=0;i<vSize;i++){
                                    var name = $(v).attr('name');
                                    name = name+"["+i+"]";


                                    formData[name] = vals[i];

                                }
                            }else {
                                var name = $(v).attr('name');
                                formData[name] = $(v).val() ;
                            }

                        }
                        //alert(name);
                    }
                });

                if(gridSelect){
                    var s = jQuery(gridId).jqGrid('getGridParam','selarrrow');
                    var gridData = {};
                    var rowId = new Array();
                    for(var i=0;i<s.length;i++){
                      var row = $(gridId).getRowData(s[i]);
                      rowId[i] = s[i];
                      $.each(row,function(k,v){
                              gridData[k] = v;
                              formData["gridData["+i+"]["+k+"]"] = v;
                              formData["gridData["+i+"][row_id]"] = s[i];
                      });
                    }
                }

                //$('body').append('<div class="ui-widget-overlay" style="width: 1583px; height: 651px; z-index: 1005; background: #FFFFFF url(images/ajax-loader.gif) no-repeat center center"></div>');
                if(uploadFile === true || debug === true){
					if (showBeforeSend) {
						dialogObj.html(beforeSend);
						dialogObj.dialog('destroy');
						dialogObj.dialog({
							modal:true,
							buttons:{},
							title:'Please Wait'
						});
					}
                    showFrameContent = true;
                    formObj.submit();
                }else{
                    formData.id = id;
                    
                    $.ajax({
                        async:true,
                        cache:false,
                        dataType:'json',
                        type:formMethod,
                        data:$.extend(formData, options.data),
                        url: urlSend,
                        error: function(XMLHttpRequest, textStatus, errorThrown){
                            typeof options.callBackError == 'function' ? options.callBackError(XMLHttpRequest, textStatus, errorThrown) : '';
                        },
                        beforeSend: function(){
                            //var dialogObj = $('#dialog');
							if (showBeforeSend) {
								dialogObj.html(beforeSend);
								dialogObj.dialog('destroy');
								dialogObj.dialog({
									modal:true,
									buttons:{},
									title:'Please Wait'
								});
							}
                        },
                        success: function(data) {
                            if(typeof(data.redirect) =="string"){ document.location.href = data.redirect; }
                            if(data.saveSuccessful){
                                removeFieldHighlights();
                                
                                if(typeof data.id != 'undefined'){
                                    id = data.id;
                                }

                                if(overrideDialogMessage){
                                    var k = "data."+replaceValue;
                                    var v = eval(k);
                                    saveComplete = saveComplete.replace(placeHolder,v);
                                }

                                formChanged = false;
                                if(showSaveComplete){
                                    dialogObj.dialog('destroy');
                                    dialogObj.html(saveComplete);
                                    dialogObj.dialog({
                                        modal:true,
                                        title:saveTitle,
                                        buttons:{
                                            'OK':function(){
                                                typeof options.callBackSuccess == 'function' ? options.callBackSuccess(data,dialogObj) : '';
                                                if(clickOnSave != false){
                                                    $(butId).trigger('click');
                                                }
                                                if(formChanged){
                                                    if(butType == 'next' || butType == 'back'){
                                                        $(tabsId).tabs('select',tabs_main);
                                                    }else if(typeof butUrl != 'undefined'){
                                                        $(tabsId).tabs('url',$(tabsId).tabs('option', 'selected'),butUrl);
                                                        $(tabsId).tabs('load',$(tabsId).tabs('option', 'selected'));
                                                    }
                                                }
                                                dialogObj.dialog('destroy');
                                            }
                                        }
                                    });
                                }else{
                                   typeof options.callBackSuccess == 'function' ? options.callBackSuccess(data,dialogObj) : '';
                                    if(clickOnSave != false){
                                        $(butId).trigger('click');
                                    }
                                   if(formChanged){
                                        if(butType == 'next' || butType == 'back'){
                                            $(tabsId).tabs('select',tabs_main);
                                        }else if(typeof butUrl != 'undefined'){
                                            $(tabsId).tabs('url',$(tabsId).tabs('option', 'selected'),butUrl);
                                            $(tabsId).tabs('load',$(tabsId).tabs('option', 'selected'));
                                        }
                                    }
                                    dialogObj.dialog('destroy');
                                }
                                if(removeDialog){
                                    dialogObj.remove();
                                }
                            }else{
                                typeof options.callBackFail == 'function' ? options.callBackFail(data) : '';
                                dialogObj.dialog('destroy');
                                dialogObj.html('<p>There are errors on the form.</p><p>Please check and try again.</p>');
                                dialogObj.dialog({
                                    modal:true,
                                    title:'Error',
                                    buttons:{
                                        'OK':function(){
                                            removeFieldHighlights();

                                            if(typeof data.errors != 'undefined'){
                                                var errObj = data.errors;
                                                var errors = new Array();
                                                var m=0;
                                                for(var i in errObj){
                                                    if(errObj[i].name == 'database' || errObj[i].name == 'userMessage'){
                                                       if(errObj[i].name == 'userMessage'){
                                                           errObj[i].name = 'User Message';
                                                       }
                                                        errors[m] = errObj[i];
                                                        m++;
                                                    }
                                                }
                                                processErrors(errObj);
                                                
                                                setTimeout(function(){
                                                        cycleDialogs(errors,0,dialogObj);
                                                },500);
                                            }
                                            dialogObj.dialog('destroy');
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            });
        }
        function cycleDialogs(Obj,index,dialogObj){
            var count = Obj.length;
            dialogObj.dialog('destroy');
            if(index < count){
                dialogObj.html('<p>'+ Obj[index].message +'</p>');
                dialogObj.dialog({
                    modal:true,
                    title:Obj[index].name + ' Infomation',
                    buttons:{
                        "Ok":function(){
                            var newIndex = index+1;
                            if(newIndex <= count){
                                cycleDialogs(Obj,newIndex,dialogObj);
                            }
                       }
                    }
                });
            }
        };
        function setFormonChange(){
            $.each(formObj.find('*'),function(k,v){
                $(v).change(function(){
                    formChanged = true;
                })
            });
        }
        function removeFieldHighlights(){
            $('*').removeClass(options.errorClass);

            $.each(formObj.find('*'),function(k,v){
                if($(v).hasClass('ui-icon-alert')){
                   $(v).remove();
                }
            });
        };
    };

    $.formValidations.defaults = {
        type:'POST',
        errorClass:'ui-state-error'

    };
})(jQuery);
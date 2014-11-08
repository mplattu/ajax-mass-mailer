var delay = 0;
var emails = [];
var emails_ = [];
var from = '';
var subject = '';
var message = '';
var emailsIndex = 0;
var emailId;
var emailCount = 0;
var files;
var formData_ = new FormData();

function sendEmail(email_, message_, subject_, from_, cb_) {

    formData_.append('email', email_);
    formData_.append('message', message_);
    formData_.append('subject', subject_);
    formData_.append('from', from_);
    console.log(formData_);

    $.ajax({
        type: 'POST',
        url: 'mailer.php',
        data: formData_,
        processData: false,
        cache: false,
        contentType: false,
        success: function(data, status, xhr) {
            cb_(data, status, xhr);
        }
    });
}

function afterSend(data, status, xhr) {
    console.log(xhr);

    try {
        var data = $.parseJSON(data);
        $("<div class='email-box " + data.sent + "'>" + data.email + "</div>").appendTo('#results');
    }
    catch(e){ 
        console.log(xhr);
        console.log(e);
    }

    var loadId = data.email.split("@");
    $('#loading-' + loadId[0]).fadeOut(function(){
        $(this).remove();
    });
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

$(document).ready(function(){
    $('#results').on('click', function(e){
        if($(this).find('.loading').length != 0) return false;
        e.preventDefault();
        var emailBoxes = $(this).children('.email-box');

        var emailBoxes = [];
        $(this).children('.email-box').each(function() {
            emailBoxes.push(this);
        });

        var fadeEach = function(collection) {
            if (collection.length > 0) {
                var item = collection.shift();
                $(item).fadeOut(function() {
                    fadeEach(collection);
                });
            }
        }

        fadeEach(emailBoxes);
    });

    $('#go').on('click', function(e){
        e.preventDefault();

        files = $('#attachment')[0].files;
        fileInput = $('#attachment')[0];
        $.each(files, function(key, value){
            formData_.append($(fileInput).attr('name'), value);
        });


        emails = $('#emails').val().split("\n");
        from = $('#from').val();
        subject = $('#subject').val();
        message = $('#message').val();

        if(message == '') {
            return false;
        }

        $.each(emails, function(i,e){
            if($.inArray(e, emails_) === -1) emails_.push(e);
        });

        var coreFunc = function(){
            if(emailId == undefined) return
            console.log(emailId + ':' + delay);
            clearInterval(emailId);

            if(emails_[emailsIndex] == undefined) {
                $('#go').removeAttr('disabled');
                emailsIndex = 0; 
                emailCount = 0;
                console.log('END'); 
                return false;
            }
            var e = emails_[emailsIndex];
            if(e == '') return false;
            var loadId = e.split("@");
            if(loadId[0] == '') return false;
            emailsIndex++;
            delay=getRandomInt(1,5);
            emailId=setInterval(coreFunc,delay*1000);
            $("<div id='loading-"+ loadId[0] + "' class='loading'>sending to " + e + "..</div>").appendTo('#results').fadeIn();
            sendEmail(e, message, subject, from, afterSend);
        }

        emailCount=emails_.length;
        $('#results').trigger('click');
        $('#go').attr('disabled','disabled');
        emailId=setInterval(coreFunc,delay*1000);

    });
});
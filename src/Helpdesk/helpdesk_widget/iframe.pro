/* eslint-disable */
function getXmlHttp(){
  var xmlhttp;
  try {
    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
  } catch (e) {
    try {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    } catch (E) {
      xmlhttp = false;
    }
  }
  if (!xmlhttp && typeof XMLHttpRequest!='undefined') {
    xmlhttp = new XMLHttpRequest();
  }
  return xmlhttp;
}

function serialize(form){
  var boundary       = String(Math.random()).slice(2);
  var boundaryMiddle = '--' + boundary + '\r\n';
  var boundaryLast   = '--' + boundary + '--\r\n'
  var cont_start  = 'Content-Disposition: form-data; name="';
  var cont_middle = '"\r\n\r\n';
  var cont_end    = '\r\n';
  var field = '';
  var body  = ['\r\n'];
  if (typeof form == 'object' && form.nodeName == "FORM") {
    for (index = form.elements.length - 1; index >= 0; index--) {
      field = form.elements[index];
      if (field.type == 'select-multiple') {
        for (option = form.elements[index].options.length - 1; option >= 0; option--) {
          if (field.options[option].selected) { body.push(cont_start + field.name + cont_middle + field.options[option].value + cont_end); }
        }
      } else {
        if (field.type != 'submit' && field.type != 'file' && field.type != 'button') {
          if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
            body.push(cont_start + field.name + cont_middle + field.value + cont_end);
          }
        } else {
          if (field.type == 'file'){
            if (field.files.length > 0) {
              body.push(cont_start + field.name + cont_middle + field.attributes['data-value'] + cont_end);
              body.push(cont_start + field.name + '_name' + cont_middle + field.files[0].name + cont_end);
            }
          }
        }
      }
    }
  }
  return [boundary, body.join(boundaryMiddle) + boundaryLast];
}

function translation(field){
  return RedmineHelpdeskIframe.configuration['translation'] ? RedmineHelpdeskIframe.configuration['translation'][field] : null;
}

function ticketCreated(){
  success_div = document.createElement('div');
  success_div.id = 'submit_button';
  success_div.className = 'success-message';
  success_div.style.textAlign = 'center';
  success_div.style.margin = '15%';
  success_div.style.font = '20px Arial';
  success_div.innerHTML = translation('createSuccessLabel') || 'Ticket was created';

  success_desc_div = document.createElement('div');
  success_desc_div.style.textAlign = 'center';
  success_desc_div.style.margin = '5%';
  success_desc_div.style.font = '14px Arial';
  success_desc_div.innerHTML = translation('createSuccessDescription');

  document.getElementById('widget_form').innerHTML = '';
  document.getElementById('widget_form').appendChild(success_div);
  document.getElementById('widget_form').appendChild(success_desc_div);
}

function ticketErrors(errors){
  errors_div = document.createElement('div');
  errors_div.id = 'ticket-error-details';
  errors_div.className = 'ticket-error-details';

  error_p = document.createElement('div');
  error_p.innerHTML = translation('createErrorLabel') || 'Can&#39;t add message ';
  errors_div.appendChild(error_p);

  errors_link = document.createElement('a');
  errors_link.id = 'ticket-errors-link';
  errors_link.href = 'javascript:void(0)';
  errors_link.style.paddingLeft = '10px';
  errors_link.addEventListener('click', function(){ toggleErrorsList() });
  errors_link.innerHTML = 'details';
  error_p.appendChild(errors_link);

  ul = document.createElement('ul');
  ul.id = 'ticket-errors';
  ul.className = 'ticket-errors';
  ul.style.display = 'none';
  errors_div.appendChild(ul);

  for (var key in errors) {
    if (key != 'base') {
      processErrorForField(ul, key, errors[key])
    } else {
      errors[key].forEach(function(error_text) {
        processErrorForCustomField(ul, key, error_text);
      });
    }
  }
  document.getElementById('flash').appendChild(errors_div);
}

function createErrorLi(target, text){
  li = document.createElement('li');
  li.id = 'ticket-error';
  li.className = 'ticket-error';
  li.innerHTML = text;
  target.appendChild(li);
}

function markFieldAsError(element){
  element.style.border = '';
  element.classList.add('error_field');
  element.addEventListener('keyup', checkFieldContent);
}

function markRequireFieldsAsError(){
  fields = document.querySelectorAll("[data-require='true'] > input, [data-require='true'] > select, [data-require='true'] > textarea, .required-field");
  required_fields = Array.from(fields);
  var respose = false;
  required_fields.forEach(function(field) {
    if (field.value.length == 0) {
      markFieldAsError(field);
      respose = true;
    }
  });
  return respose;
}

function unmarkFieldsAsError(){
  error_fields = Array.from(document.getElementsByClassName('error_field'));
  error_fields.forEach(function(field) {
    field.classList.remove('error_field');
    field.removeEventListener('keyup', checkFieldContent);
  });
}

function checkFieldContent(){
  if (this.value.length > 0) {
    this.style.border = '1px solid #d9d9d9';
  } else {
    this.style.border = '1px solid red';
  }
}

function processErrorForField(ul, key, error_text) {
  createErrorLi(ul, error_text);
  field = document.getElementById(key);
  if (field != null) { markFieldAsError(field); }
}

function processErrorForCustomField(ul, key, error_text) {
  checkCustomFieldsOnError(error_text);
  createErrorLi(ul, error_text);
}

function checkCustomFieldsOnError(error_text){
  custom_fields = Array.from(document.getElementsByClassName('custom_field'));
  custom_fields.forEach(function(cfield) {
    cfield_regex = new RegExp(cfield.attributes['data-error-key'].value);
    if (cfield_regex.test(error_text)){
      markFieldAsError(cfield.getElementsByTagName('input')[0]);
    }
  });
}

function toggleErrorsList(){
  errors_list = document.getElementById('ticket-errors');
  if (errors_list == null) { return true }
  if (errors_list && errors_list.style.display == 'block') {
    errors_list.style.display = 'none';
  } else {
    errors_list.style.display = 'block';
  }
}

function processResponse(response){
  if (response['result']) {
    ticketCreated();
    parent.postMessage(JSON.stringify({ reload: true }), "*");
  } else {
    ticketErrors(response['errors']);
  }
  var formSubmitBtn = document.getElementById('form-submit-btn');
  if (formSubmitBtn){
    formSubmitBtn.disabled = false;
  }
}

function needReloadProjectData(){
  parent.postMessage(JSON.stringify({ project_reload: true }), "*");
}

function arrangeIframe(){
  parent.postMessage(JSON.stringify({ arrange: true }), "*");
}

function closeTicketForm(){
  parent.postMessage(JSON.stringify({ close: true }), "*");
}

function submitTicketForm(base_url){
  document.getElementById('flash').innerHTML = '';
  unmarkFieldsAsError();
  if (markRequireFieldsAsError()){ return false; }
  // var base_url = 'https://taskman.eionet.europa.eu'
  var xmlhttp = getXmlHttp();
  var serialize_result = serialize(document.getElementById('widget_form'));
  var boundary = serialize_result[0];
  var form_params = serialize_result[1];
  document.getElementById('form-submit-btn').disabled = true;
  xmlhttp.open('POST', base_url + '/helpdesk_widget/create_ticket', true);
  xmlhttp.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4) {
      if (xmlhttp.status == 200 || xmlhttp.status == 304) {
        processResponse(JSON.parse(xmlhttp.responseText));
      } else {
        processResponse({result: false, errors: []});
      }
    }
  };
  xmlhttp.send(form_params);
}

arrangeIframe();

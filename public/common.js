
(function() {
  
	var app = {
		
		initialize : function () {			
			this.modules();
			this.setUpListeners();
		},
 
		modules: function () {
 
		},
 
		setUpListeners: function () {
            $('form').on('submit', app.submitForm());
		},
 
		submitForm: function (e) {
            /*e.preventDefault();*/
            console.log("nice submitForm");
			var form = $(this);
			if(app.validateForm(form)===false) return false;
		},

		validateForm: function (form) {
			var inputs = form.find('input'),
				valid = true;
			inputs.tooltip('destroy');
			$.each(inputs, function (index, val) {
				var input = $(val),
					val = input.val(),
					formGroup = input.parents('.form-group'),
					label = formGroup.find('label').text().toLowerCase(),
					textError = 'Введите' + label;
				console.log('input', val);
				if(val.length === 0){
					formGroup.addClass('has-error').removeClass('has-succes');
					input.tooltip({
						trigger:'manual', //tooltip вызывается только по команде
						placement:'right', //показывать только справа
						title: textError // показать ошибку
					}).tooltip('show');
					valid = false;
				}else{
                    formGroup.addClass('has-succes').removeClass('has-error');
				}

            });
            return valid;

        }
		
	}
 
	app.initialize();
 
}());
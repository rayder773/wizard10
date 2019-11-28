(function($) {

    $.fn.wizzy = function(options) {

        let settings = $.extend({
            stepNumbers: false,
            progressType: 'fill',
        }, options);

        return this.each(function() {
            let elem = $(this);
            let nav = elem.find('.wz-header nav');
            let navigator = elem.find('.wz-navigator');
            let content = elem.find('.wz-inner');

            let btnNext = '<a href="#" class="btn next" data-action="next">Далее <i class="fas fa-angle-right"></i></a>';
            let btnBack = '<a href="#" id="prev" class="btn previous" data-action="back"><div class="prev-btn"></div></a>';
            let btnFinish = '<a href="#" class="btn btn-success right" data-action="finish">Finish <i class="fas fa-check"></i></a>';

            let step_links = elem.find('nav a').toArray();
            let step_count = step_links.length;
            let step_status = new Array(step_count);
            let step_content = elem.find('.wz-step').toArray();
            let link_width = $(step_links[0]).width();
            let step = 0;

            function init() {
                for (i = 1; i < step_count; i++) {
                    step_status[i] = 0;
                }
                step_status[0] = 1;
                updateTemplate();
                render();
            }

            function moveProgress(step) {
                if (settings.progressType == 'fill') {
                    let progressWidth = link_width * (step + 1);
                    nav.find('.progress').css({ 'width': progressWidth + 'px' });
                }
                if (settings.progressType == 'slide') {
                    nav.find('.progress').css({ 'width': link_width + 'px' });
                    let distance = link_width * (step);
                    nav.find('.progress').css({ 'left': distance + 'px' });
                }

            }

            function updateTemplate() {
                nav.append('<div class="progress"></div>');
                moveProgress(step);
                step_links.forEach(element => {
                    $(element).wrapInner('<span></span>');
                });
            }

            /**
             * 
             * @param {boolean} show 
             */
            function loader(show) {
                let loader = '<div class="loading"></div>';
                if (show === true) { //Show Loader Spinner
                    content.fadeOut(400, function() {
                        elem.addClass('progress');
                        setTimeout(() => {
                            elem.append(loader);
                        }, 500);
                    });
                } else {
                    elem.find('.loading').remove();
                    elem.removeClass('progress');
                    setTimeout(() => {
                        content.fadeIn(400);
                    }, 400);
                }
            }

            /**
             * 
             * @param {string} action 
             */
            function react(action) {

                if (step >= 0 && step < step_count) {
                    if (action === 'next') {
                        if (elem[0].textContent.match('E-mail абитуриента') == 'E-mail абитуриента') {
                            // let isValid = ($('#emailInput').val().match(/.+?\@.+/g) || []).length === 1;
                            // if (!isValid) {
                            //     $('#emailInput').addClass("wizard-invalid-input");
                            //     return false;
                            // } else {
                            //     $('#emailInput').removeClass("wizard-invalid-input");
                            // }
                            var regExp = /^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/;

                            $('#emailInput').on('keyup', function() {
                                console.log($(this).val())
                                regExp.test($(this).val()) ? $(this).removeClass('wizard-invalid-input') : $(this).addClass('wizard-invalid-input');
                            });
                            return false

                        }
                        step_status[step++] = 1;
                        if (step_status[step] === 0) {
                            step_status[step] = 1;
                        }
                        render(step);
                    } else if (action == 'back') {
                        step--;
                        render(step);
                    } else if (action == 'finish') {
                        loader(true);
                        setTimeout(() => {
                            loader(false);
                        }, 3000);
                    }
                }

            }

            /**
             * Render out the content
             */
            function render() {
                navigator.html('');

                if (step === 0) {
                    btnBack = '<a href="#" id="prev" class="previous"><div class="prev-btn"></div></a>';
                    navigator.append(btnBack, btnNext);
                } else if (step === step_count - 1) {
                    navigator.append(btnBack + btnFinish);
                } else {
                    btnBack = '<a href="#" id="prev" class="btn previous" data-action="back"><div class="prev-btn"></div></a>';
                    navigator.append(btnBack + btnNext);
                }

                elem.find('nav a').removeClass('active completed');
                for (i = 0; i < step; i++) {
                    $(step_links[i]).addClass('completed');
                }
                $(step_links[i]).addClass('active');

                elem.find('.wz-body .wz-step').removeClass('active');
                $(step_content[step]).addClass('active');

                elem.find("#counter").text(((step + 1) / (step_count) * 100).toFixed() + '%');

                moveProgress(step);
            }

            /**
             * Click events
             */
            $(elem).on('click', '.wz-navigator .btn', function(e) {
                e.preventDefault();
                let action = $(this).data('action');
                react(action);
            });

            $(elem).on('click', 'nav a', function(e) {
                e.preventDefault();
                let step_check = $(this).index();
                if (step_status[step_check] === 1 || step_status[step_check] === 2) {
                    step = $(this).index();
                    render();
                } else {
                    console.log('Check errors');
                }
            });


            init();
        });
    }

}(jQuery));
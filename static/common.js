$(document).ready(function(){
	$('body').on('click','div.input.select li', function(){
		$(this).addClass('selected').siblings().removeClass('selected');
		$(this).parents('div.select').prev().val($(this).data('value')).trigger('change');
		$(this).parents('div.input.select').find('span').first().html($(this).html());
		// $('select option').prop('disabled', false)
		console.log($(this).html())

		$('select option[data-'+$(this).parents('div.select').prev().data('childs')+']').parent().val('').trigger('change')//обнуляем выбор последующих элементов

		//$('select').change()
		customize_select()
	});


	customize_select();

	$('select').change(function(){


		var parentval='';

		child=$(this).data('parent')

		while($('select[name="'+child+'"]').length){

			if($('select[name="'+child+'"]').val()) parentval=($('select[name="'+child+'"]').val())+parentval;
			child=$('select[name="'+child+'"]').data('parent')
		}


		$('select option[data-'+$(this).data('childs')+']').prop('disabled', false)
		$('select option[data-'+$(this).data('childs')+']').not('[data-'+$(this).data('childs')+'*="#'+parentval+$(this).val()+'#"]').prop('disabled', true)

		if(!$(this).val())
			$('select option[data-'+$(this).data('childs')+']').parent().val('').trigger('change')//обнуляем выбор последующих элементов

		$('select option[value=""]').prop('disabled', false)

		$('select option[data-'+$(this).attr('name')+']:disabled').prop('selected', false)

		if(!$('select option[data-'+$(this).attr('name')+']:selected').length)
			$('select option[data-'+$(this).attr('name')+'][value=""]').prop('selected', true)


		if(!$(this).find('option').not(':disabled').length) $(this).prop('disabled', true)
		else  $(this).prop('disabled', false)

	})


	$('body div.input.select li').first().click()
	$('#upload').removeClass('disabled')

	$('.adddetal').click(function(){
		$('.emptytable').hide()

		$('table.detals tbody').append($('table.detals tr.copy').clone().removeClass('copy'))

		index=0
		$('table.detals tbody tr').not('.anglesinfo, .copy').each(function(){
			$(this).find('td').first().html(++index)
		})

		$('.rascroi').removeClass('disabled')
		customize_select()
	})

	$('#cost_calc').click(function(){
		if($(this).hasClass('disabled')) return;

		params={'params':{}, 'detail':{}, 'action':'get_results'}
		$('form.params input, form.params select').each(function(){
			if($(this).attr('type')=='checkbox' && !$(this).prop('checked')) return;

			params['params'][$(this).attr('name')]=$(this).val()
		})
		$('table.detals tr').not('.copy, .anglesinfo').each(function(){
			detail=$(this).index()
			params['detail'][detail]={}
			$(this).find('input, select').each(function(){
				params['detail'][detail][$(this).attr('name')]=$(this).val()
			})

		})

		$('.results').html('<div class="center"><img src="https://cdn-images-1.medium.com/max/1600/1*inYwyq37FdvRPLRphTqwBA.gif" alt="" /></div>')


		$.post('./',params,function(data){
			$('.results').html(data)
			customize_select()
			console.log(data)
			if (data != 'Введены не все данные, или данные не корректны')
				$('#cost_calc').hide()
		})
	})


	$('table.detals').on('click','.del', function(){
		$(this).parents('tr').next().remove()
		$(this).parents('tr').remove()

		index=0
		$('table.detals tbody tr').not('.anglesinfo, .copy').each(function(){
			$(this).find('td').first().html(++index)
		})

		if(!$('table.detals tbody tr:not(.copy)').length) {
			$('.rascroi').addClass('disabled')
			$('.emptytable').show()
		}


	})


	$('table.detals').on('click','span.c', function(){
		var selected= $(this).hasClass('selected');

		if($(this).hasClass('top')){
			$(this).parents('td').find('.c.top').removeClass('selected')
			$(this).parents('td').find('input[name*="top"]').val(selected?0:$(this).data('value'))
		}else{
			$(this).parents('td').find('.c.bottom').removeClass('selected')
			$(this).parents('td').find('input[name*="bottom"]').val(selected?0:$(this).data('value'))

		}

		if(!selected) $(this).addClass('selected')
	})

	$('body').on('change','select[name="delivery"]', function(){
		$(this).parents('tr').find('td').last().find('span').first().html($(this).find('option:selected').data('price'))
		$('.results table .itog span').first().html(parseFloat($('.results table .itog').data('price')) + parseFloat($(this).find('option:selected').data('price')))
	})

	$('body').on('change','select[name="material"]', function(){
		if($(this).val()=='ДВП' || $(this).val()=='ДСП' || $(this).val()=='МДФ'){
			$('select[name="decor"]').closest('div').hide()
			$('input[name="texture"]').prop('checked',false).closest('div').hide()
		}else{
			$('select[name="decor"]').closest('div').show()
			$('input[name="texture"]').closest('div').show()
		}
	})




	$('.results').on('click','.btn.order', function(){
		$('.window.order').show()
		$('.window.order input[name="uorder"]').val($(this).data('order'))
		$('.window.order input[name="udelivery"]').val($('.results select[name="delivery"]').val())

	})

	$('body').on('click','div.input.select',function(e){
		$('div.input.select').not(this).removeClass('hover');
		$(this).toggleClass('hover');
		if($(this).hasClass('hover')){

			if($(this).offset().top-$(window).scrollTop() + $(this).find('ul').height() > $(window).height())
				$(this).addClass('top')
			else
				$(this).removeClass('top')
		}else
			$(this).removeClass('top')
		e.stopPropagation();
		return false;
	})

	$('body').on('click',function(event){
			$('div.input.select').removeClass('hover')

	})


	$('table.detals').on('click','.angles', function(){
		$('.window.angles').show().data('row',$(this).parents('tr').index())
		a1=$(this).parents('td').find('input[name="a1"]').val().split('#');
		a2=$(this).parents('td').find('input[name="a2"]').val().split('#');
		a3=$(this).parents('td').find('input[name="a3"]').val().split('#');
		a4=$(this).parents('td').find('input[name="a4"]').val().split('#');


		w=$(this).parents('tr').find('input[name="width"]').val()
		l=$(this).parents('tr').find('input[name="length"]').val()


		$('.window.angles .content .width').html(w)
		$('.window.angles .content .height').html(l)

		$('.window.angles .content .lt').removeClass('radius skos').addClass(a1[0])
		$('.window.angles .content .rt').removeClass('radius skos').addClass(a2[0])
		$('.window.angles .content .lb').removeClass('radius skos').addClass(a3[0])
		$('.window.angles .content .rb').removeClass('radius skos').addClass(a4[0])

		$('.window.angles .content span.type').removeClass('selected')
		$('.window.angles .content span.type[data-angle="lt"][data-type="'+a1[0]+'"]').addClass('selected')
		$('.window.angles .content span.type[data-angle="rt"][data-type="'+a2[0]+'"]').addClass('selected')
		$('.window.angles .content span.type[data-angle="lb"][data-type="'+a3[0]+'"]').addClass('selected')
		$('.window.angles .content span.type[data-angle="rb"][data-type="'+a4[0]+'"]').addClass('selected')


		$('.window.angles .content span.type[data-angle="lt"]').parents('div').find('info[data-type="'+a1[0]+'"] input').first().val(a1[1])
		$('.window.angles .content span.type[data-angle="lt"]').parents('div').find('info[data-type="'+a1[0]+'"] input').last().val(a1[2])
		$('.window.angles .content span.type[data-angle="rt"]').parents('div').find('info[data-type="'+a2[0]+'"] input').first().val(a2[1])
		$('.window.angles .content span.type[data-angle="rt"]').parents('div').find('info[data-type="'+a2[0]+'"] input').last().val(a2[2])
		$('.window.angles .content span.type[data-angle="lb"]').parents('div').find('info[data-type="'+a3[0]+'"] input').first().val(a3[1])
		$('.window.angles .content span.type[data-angle="lb"]').parents('div').find('info[data-type="'+a3[0]+'"] input').last().val(a3[2])
		$('.window.angles .content span.type[data-angle="rb"]').parents('div').find('info[data-type="'+a4[0]+'"] input').first().val(a4[1])
		$('.window.angles .content span.type[data-angle="rb"]').parents('div').find('info[data-type="'+a4[0]+'"] input').last().val(a4[2])
	})


	$('table.detals').on('click','.paz', function(){
		$('.window.paz').show().data('row',$(this).parents('tr').index())
		customize_select()
	})

	$('table.detals').on('click','.prisadka', function(){
		$('.window.prisadka').show().data('row',$(this).parents('tr').index())
		customize_select()
	})

	$('body').on('click',' .window.prisadka .content .btn', function(){
		$(this).parents('.window').hide()
		a=$('#prisadka')[0].value
		tr=$('table.detals tbody tr').eq(parseInt($('.window.prisadka').data('row')))
		tr.next().next().next().find('em').html('')
		if (a == "1")
			tr.next().next().next().find('em').append('В детали необходимы только простые отверстия (евровинт, сквозные отверстия)')
		if (a == "2")
			tr.next().next().next().find('em').append('В детали необходимо хотя бы одно отверстие (сложная присадка)')
		tr.find('input[name="prisadka"]').val(a)
	})


	$('body').on('click',' .window.paz .content .btn', function(){
		$(this).parents('.window').hide()
		a=$('#paz')[0].value
		tr=$('table.detals tbody tr').eq(parseInt($('.window.paz').data('row')))
		tr.next().next().find('em').html('')
		if (a == "1")
			tr.next().next().find('em').append('Паз под заднюю стенку ДВП 4мм')
		if (a == "2")
			tr.next().next().find('em').append('Выборка четверти под заднюю стенку ДВП 4мм.')
		tr.find('input[name="paz"]').val(a)
	})

	$('body').on('click',' .window.angles .content .btn', function(){
		$(this).parents('.window').hide()

		tr=$('table.detals tbody tr').eq(parseInt($('.window.angles').data('row')))
		tr.next().find('em').html('')

		a1=$('.window.angles .content span.type[data-angle="lt"].selected').data('type')
		a1val1=$('.window.angles .content span.type[data-angle="lt"].selected').closest('div').find('.info[data-type="'+a1+'"] input').first().val()
		a1val2=$('.window.angles .content span.type[data-angle="lt"].selected').closest('div').find('.info[data-type="'+a1+'"] input').last().val()
		if(a1=='radius')
			tr.next().find('em').append('Верхний левый угол: Радиус '+a1val1+' мм<br />')
		if(a1=='skos')
			tr.next().find('em').append('Верхний левый угол: Скос '+a1val1+' мм; '+a1val2+' мм<br />')

		tr.find('input[name="a1"]').val(a1+'#'+a1val1+'#'+a1val2)


		a2=$('.window.angles .content span.type[data-angle="rt"].selected').data('type')
		a2val1=$('.window.angles .content span.type[data-angle="rt"].selected').closest('div').find('.info[data-type="'+a2+'"] input').first().val()
		a2val2=$('.window.angles .content span.type[data-angle="rt"].selected').closest('div').find('.info[data-type="'+a2+'"] input').last().val()
		if(a2=='radius')
			tr.next().find('em').append('Верхний правый угол: Радиус '+a2val1+' мм<br />')
		if(a2=='skos')
			tr.next().find('em').append('Верхний правый угол: Скос '+a2val1+' мм; '+a2val2+' мм<br />')

		tr.find('input[name="a2"]').val(a2+'#'+a2val1+'#'+a2val2)

		a3=$('.window.angles .content span.type[data-angle="lb"].selected').data('type')
		a3val1=$('.window.angles .content span.type[data-angle="lb"].selected').closest('div').find('.info[data-type="'+a3+'"] input').first().val()
		a3val2=$('.window.angles .content span.type[data-angle="lb"].selected').closest('div').find('.info[data-type="'+a3+'"] input').last().val()
		if(a3=='radius')
			tr.next().find('em').append('Нижний левый угол: Радиус '+a3val1+' мм<br />')
		if(a3=='skos')
			tr.next().find('em').append('Нижний левый угол: Скос '+a3val1+' мм; '+a3val2+' мм<br />')

		tr.find('input[name="a3"]').val(a3+'#'+a3val1+'#'+a3val2)

		a4=$('.window.angles .content span.type[data-angle="rb"].selected').data('type')
		a4val1=$('.window.angles .content span.type[data-angle="rb"].selected').closest('div').find('.info[data-type="'+a4+'"] input').first().val()
		a4val2=$('.window.angles .content span.type[data-angle="rb"].selected').closest('div').find('.info[data-type="'+a4+'"] input').last().val()
		if(a4=='radius')
			tr.next().find('em').append('Нижний правый угол: Радиус '+a4val1+' мм<br />')
		if(a4=='skos')
			tr.next().find('em').append('Нижний правый угол: Скос '+a4val1+' мм; '+a4val2+' мм<br />')

		tr.find('input[name="a4"]').val(a4+'#'+a4val1+'#'+a4val2)

	})


	$('body').on('click','.window .close, .window .cancel', function(){
		$(this).parents('.window').hide()
	})


	$('body').on('click','.window.angles .content span.type', function(){
		$(this).addClass('selected').siblings().removeClass('selected');
		$('.window.angles .content .'+$(this).data('angle')).removeClass('radius skos')
		$('.window.angles .content .'+$(this).data('angle')).addClass($(this).data('type'))
	})


	$('body').on('submit','form[name="order"]', function(){
		$('input[name="uorder"]')[0].value = $('.results div')[0].getAttribute('data-order')
		var fd = new FormData($(this)[0]);
		$('.window').hide()
		$.ajax({
			url: './',
			data: fd,
			processData: false,
			contentType: false,
			type: 'POST',
		});
		alert('Спасибо за заявку! Мы скоро свяжемся с вами');

		return false;
	})
})


function customize_select(){
	$('div.input.select').remove();

	$('select').each(function(){
		var div='<div class="'+($(this).find('option').not(':disabled').length==1 && $(this).find('option').not(':disabled').val()==''?'disabled':'')+' input select '+($(this).prop('disabled')?'disabled':'')+' '+($(this).attr('class'))+'" style="width: '+($(this).width()+70+($(this).find('option[data-thumbnail]').length?85:0))+'px">';

		if($('select[name="decor"]').find('option').not(':disabled').length==1)
			$('input[name="texture"]').prop('disabled',true)
		else
			$('input[name="texture"]').prop('disabled',false)


		div +='<span>'+($(this).prop('selected')?'class="selected"':'')+($(this).find('option[value="'+($(this).val()?$(this).val():'')+'"]').data('thumbnail')?'<span class="img" style="background: url(\''+$(this).find('option[value="'+($(this).val()?$(this).val():'')+'"]').data('thumbnail')+'\')"></span>':'')+$(this).find('option[value="'+($(this).val()?$(this).val():'')+'"]').html()+'</span><ul>';
		$(this).find('option').each(function(){
			if(!$(this).prop('disabled')) div += '<li data-value="'+$(this).val()+'" '+($(this).prop('selected')?'class="selected"':'')+'>'+($(this).data('thumbnail')?'<span class="img" style="background: url(\''+$(this).data('thumbnail')+'\')"></span>':'')+$(this).html()+'</li>';
		});
		div+='</ul></div>';
		$(this).hide().after(div);
	});
}

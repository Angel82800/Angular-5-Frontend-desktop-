$(document).ready(function() {
	alert("load");
	$('.myfav').click(function() {
		alert('click');
	});
	$('.myfav2').click(function() {
		alert('click-2');
	});
	function favselected() {
		alert("alert");
	}
});

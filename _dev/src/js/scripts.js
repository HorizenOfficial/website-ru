var header = $('.site-header');

$(function() {
    header.headroom({
        "tolerance": 5,
        "offset": 40,
        "classes": {
            "initial": "animated",
            "pinned": "slideDown",
            "unpinned": "slideUp",
            "top": "headroom--top",
            "notTop": "headroom--not-top"
        }
    });
});

// Smooth page scroll to an anchor on the same page
$(function() {
    $('a[href*="#"]:not([href="#"]):not([data-toggle="collapse"]):not([data-toggle="reveal"]):not(.quote-link)').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
});
var $mcForm = $('#email-form');

$mcForm.ajaxChimp({
  url: $mcForm.attr('action'),
  callback: callbackFunction
});

function callbackFunction (resp) {
    if (resp.result === 'success') {
      // console.log('success');
      $mcForm.fadeOut();
      $('#email-success').fadeIn();
    } else if (resp.result === 'error') {
      $('#email-form .form-group').addClass('has-warning');
      if (resp.msg.indexOf("is already subscribed") >= 0) {
        // console.log('already subscribed');
        $('#email-form .form-control-feedback').text("Looks like you're already subscribed.");
      } else if (resp.msg.indexOf("Please enter a value") >= 0) {
        // console.log('no email address');
        $('#email-form .form-control-feedback').text('Please enter an email address.');
      } else if (resp.msg.indexOf("Too many subscribe attempts") >= 0) {
        // console.log('too many attempts');
        $('#email-form .form-control-feedback').text('Please wait 5 mintutes and try again.');
      } else if (resp.msg.indexOf("must contain a single @") >= 0 || resp.msg.indexOf("domain portion of the email address is invalid") >= 0) {
        // console.log('invalid email address');
        $('#email-form .form-control-feedback').text('Please enter a valid email address.');
      } else {
        console.log(resp);
        $('#email-form .form-control-feedback').text('Oops. Not sure what went wrong. Please try again soon.');
      }
    }
}

$(function() {
    var bLazy = new Blazy({
        success: function(element) {
            setTimeout(function() {
                var parent = element.parentNode;
                parent.className = parent.className.replace(/\bloading\b/,'');
            }, 200);
        }
    });

    // Add plus and minus symbols to accordion tabs
    $('#accordion .card-header a').append('<i class="fa fa-plus" aria-hidden="true"></i><i class="fa fa-minus" aria-hidden="true"></i>');
});

$('[data-toggle="reveal"]').click(function(event) {
  var container = $('#quickLinks');
  var card = $('#quickLinks .card');
  var target = $(this).attr('href');
  event.preventDefault();
  if ( !card.hasClass('show') ) {
    card.addClass('show').fadeIn();
  }
  $('.reveal').removeClass('show');
  $(target).addClass('show');

  var height = $(target).outerHeight();
  card.css('height', height);

  console.log(height);
});

// Toggle active class for hamburgers
$('.hamburger').click(function() {
    $(this).toggleClass('is-active');
    $('#mobile-nav').toggleClass('visible');
});

// Move navbar contents to different container on mobile
var navbarContents = $('#navContents');
enquire.register("screen and (max-width:991px)", {
    match: function() {
        $(navbarContents).appendTo('#mobile-nav');
    },
    unmatch: function() {
        $(navbarContents).appendTo('#navContainer');
    }
});

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
/*
$.ajax({
  url: 'https://aayanl.tech/insight-api/status',
  dataType: 'json',
  success: function(data) {
    $('#currentBlock').text(numberWithCommas(data.info.blocks));
    $('#blockLine').fadeIn();
  }
})
*/


var listTemplate = document.getElementById("template-blog-post");
var templateHtml = listTemplate.innerHTML;

$.ajax({
  type: "GET",
  url: "https://blog.zensystem.io/wp-json/wp/v2/posts",
  dataType: "json",
  data: {
    categories_exclude: [66, 52]
  },
  success: function(dataJSON) {
    var dataObject = dataJSON;
    document.getElementById("blogPosts").innerHTML = listCreateHtml(dataJSON);
  }
});

// Function to generate and returns the HTML.
// Accepts an object as a parameter
function listCreateHtml(dataObject) {
  var listHtml = "";

  for (key in dataObject) {
    var numberOfPosts = 3;
    if (key < numberOfPosts) {
      listHtml += templateHtml.replace(/{{link}}/g, dataObject[key].link)
                              .replace(/{{title}}/g, dataObject[key].title.rendered)
                              .replace(/{{excerpt}}/g, dataObject[key].excerpt.rendered);
    } else {

    }
  }

  return listHtml;
}

$('#feedbackTextarea').focus(function() {
  if (!$(this).hasClass('cleared')) {
    $(this).html('').addClass('cleared');
    console.log('boom');
  }
});

$('#feedback-submit').click(function(event) {
  var honeypot = $('#form-field').val();
  event.preventDefault();
  if ( honeypot.length == 0 ) {
    $('#feedback-form').submit();
  }
});

// *************************************
// APP
// *************************************
var App = (function() {

  function handleSubmit(event) {
    event.preventDefault();
    var inputValue = event.target[0].value;
    var searchType = event.target[1].value;
    Solib(handleData, searchType).init(inputValue);
  }

  function handleData(data) {
    View.updateDOM(data);
  }

  return {
    start: function() {
      console.log('App started');
      Input.attachListener(View.getElement('js-form'), 'submit', handleSubmit);
    },
  };

})();





// *************************************
// INPUT
// *************************************
var Input = (function() {

  function attachListener(element, eventType, cb) {
    element.addEventListener(eventType, cb);
  };

  return {
    attachListener: attachListener,
  }

})();



// *************************************
// VIEW
// *************************************
var View = (function() {

  function getElement(id, node) {
    return (document || node).getElementById(id);
  };

  function processData(object) {
    var li = document.createElement('li');
    li.className = 'results__item';
    var a = document.createElement('a');
    a.href = object.link;
    a.className = 'results__link';
    a.innerHTML = object.text;
    li.appendChild(a);
    return li;
  }

  function updateDOM(data) {
    var output = getElement('js-output');
    output.innerHTML = '';
    data.slice(0,12).forEach(function(object) {
      output.appendChild(processData(object));
    })
  }

  return {
    getElement: getElement,
    updateDOM: updateDOM,
  };

})();



// *************************************
// SOLIB
// *************************************
var Solib = function(dataCallback, searchType) {

  function createURL(tag) {
    var apiUrls = {
      'unanswered': `https://api.stackexchange.com/2.2/questions/unanswered?order=desc&sort=activity&site=stackoverflow&tagged=${tag}`,
      'top-answerers': `https://api.stackexchange.com/2.2/tags/${tag}/top-answerers/all_time?site=stackoverflow`
    };

    return apiUrls[searchType];
  };

  function handleData(data) {
    var data = data.items.map(function(item) {
      switch(searchType) {
        case 'unanswered':
          return {
            link: item.link,
            text: item.title,
          };
        case 'top-answerers':
          return {
            link: item.user.link,
            text: item.user.display_name
          };
      }
    });
    dataCallback(data);
  }

  function init(query) {
    Fetch.makeRequest('GET', createURL(query), handleData);
  }
  return {
    init: init,
  };

};




// *************************************
// Fetch
// *************************************
var Fetch = (function() {
  function makeRequest(method, url, cb) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        cb(JSON.parse(request.responseText));
      }
    }
    request.open(method, url, true);
    request.send();
  }

  return {
    makeRequest: makeRequest,
  };

})();


App.start();

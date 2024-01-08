
var parseInput = document.getElementById("parseInput");
var parseButton = document.getElementById("parseButton");
var grammarButton = document.getElementById("grammarButton");
var parseOutput = document.getElementById("parseOutput");

var parser;

var myParser = function myParser() {
  console.log('myParser', parser);

  try {
    Parser = parser.createParser();
  } catch (e) { }
  console.log('Parser', Parser);
  const content = parseInput.value;
  const result = Parser.parse(content);
  try {
    parseOutput.value = JSON.stringify(result, null, 2);
  } catch (e) {
    if (e) {
      throw new Error(e.what);
    }
  }
}


function processGrammar() {
  function onError(e) {
    console.log(e);
    $("#gen_out").text("Oops. Make sure your grammar is in the correct format.\n" + e.stack)
      .removeClass('good')
      .removeClass('warning')
      .addClass('bad');
  }

  var cfg;
  var type = $('#type')[0].options[$('#type')[0].selectedIndex].value || 'slr';

  var grammar = $('#grammar').val();
  try {
    cfg = JSON.parse(grammar);
  } catch (e) {
    try {
      cfg = Jison.ebnfParser.parse(grammar);
    } catch (e) {
      return onError(e);
    }
  }

  if (cfg.lex) {
    $('#parsing').show();
  }
  else {
    $('#parsing').hide();
  }

  //    Jison.print = function () { };
  parser = new Jison.Generator(cfg, {
    type: type,
    noDefaultResolve: true
  });
  console.log('parser', parser);

  if (parser.computeLookaheads) {
    parser.computeLookaheads();
  }

  $("#gen_out").removeClass("good").removeClass("bad").removeClass('warning');
  if (!parser.conflicts) {
    $("#gen_out").text('Generated successfully!').addClass('good');
  } else {
    $("#gen_out").text('Conflicts encountered:\n').addClass('bad');
  }

  nonterminalInfo(parser);
  productions(parser);
  if (type === 'll') {
    llTable(parser);
  }
  else {
    lrTable(parser);
  }
  console.log('parser', parser);
}

parseButton.addEventListener("click", myParser, false);
grammarButton.addEventListener("click", processGrammar, false);

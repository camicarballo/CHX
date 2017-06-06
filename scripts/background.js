//Shared output for recursive functions/code
var stdOut="";

//Read omnibox input to parser
chrome.omnibox.onInputEntered.addListener( function(text){
  parse(text);
});

// All functions for checking whether a command is valid and the function to 
// execute if it is are stored in this array
// USAGE:
//  modules = [
//    [
//      function check(),
//      function exec()
//    ]
//  ]
var modules = [];

// function for adding a module to the modules function
// this wrapper should reduce the overhead of including functions from different scripts
function addModule(check,exec){
  modules.push([check,exec]);
}


// Function to parse commands
// Indexed through each module, call checker, and if it returns true call its exec function
// INPUT:
//   str - raw text of the command
// OUTPUT: 
//   NONE - commands are executed in their own way
function parse( str ){
  args = str.split(" ");
  // Command always comes first
  com = args.shift();

  // Start iterating through module checkers
  // First module to return true is executed, which means any keyword used for
  //  only one module is reserved
  for(i in modules){
    if(modules[i][0](com)){
      modules[i][1](args);
      return;
    }
  }
  // Final fail case to execute if no commands check out
  alert("ERROR. Command not found.");
}

function check_test(){
  return true;
}

function test(){
  alert("Command Executing");
}

addModule(isGoogleCommand, google_search);

addModule(isSettingsPage, settings_load);
addModule(isExtensionsPage, extensions_load);

//addModule(isDriveApp,);
//addModule(isMailApp,);
addModule(isWikiApp, wikipedia_search);
/*
  } else if( isDriveApp(com) ){
		if ( args.length>0 ){
			navigate( "https://drive.google.com/drive/u/"+args[0]+"/" );
		} else {
			navigate( "https://drive.google.com/drive/u/0/" );
		}
  } else if( isMailApp(com) ){
		if ( args.length>0 ){
			navigate( "https://mail.google.com/mail/u/"+args[0]+"/" );
		}	else {
			navigate( "https://mail.google.com/mail/u/0/" );
		}
  }
*/

//function that handles bookmark-related commands
//just reads command details and calls the next operation
//INPUT:
//   params - an array of parameters
function bookmark_utility( params ){
  switch ( params.shift() ){
    case "add":
      bu_add(params);
      break;
    case "list":
      bu_list(params);
      break;
    default:
      navigate("chrome://bookmarks");
  }
}

//List the bookmark tree
// Takes at most one parameter
// IF PARAM: list the bookmark tree under that parameter
// IF NOT PARAM: list bookmark tree of entire hierarchy
function bu_list(params){
  if (params.length > 0){
    for (i in params){
      chrome.bookmarks.getTree(function(result){
        stdOut=params[i]+"\n";
        for(c in result[0].children){
          tree_delve(result[0].children[c],params[i].split("\\"));
        }
        alert(stdOut);
        stdOut="";
      });
    }
  } else {
    chrome.bookmarks.getTree(function(result){
      stdOut="";
      stdOut+="All Bookmarks\n";
      for(c in result[0].children){
        ls(result[0].children[c],1,stdOut);
      }
      //When we're done, print string
      alert(stdOut);
      stdOut="";
    });
  }
}
//Recursively go through a series of given parameters
function tree_delve(folder,params){
  console.log(folder);
  console.log(params);
  dir=params.shift();
  console.log(dir);
  //if this was the end of path, list everythin
  // else continue delving
  if( params.length > 0 ){
    for(c in folder.children){
      if(folder.children[c].title == dir){
        tree_delve(folder.children[c],params);
      }
    }
  } else {
    for(c in folder.children){
      if(folder.children[c].title == dir){
        for(l in folder.children[c].children){
          stdOut+="-|"+folder.children[c].children[l].title+"\n";
        }
      }
    }
  }
}
//recursive look into bookmark object tree
function ls(node, tabOrder, output){
  for(var i=0; i<tabOrder; ++i){
   stdOut+="-|"; 
  }
  stdOut += node.title;
  stdOut += "\n";
  for(c in node.children){
    ls(node.children[c],tabOrder+1,output);
  }
}

//Find the id of a folder/file
function find(term){
  stdOut=-1
  chrome.bookmarks.getTree(function(result){
    re_find(term, result[0]);
  });
  
}
//recursive element of find function
function re_find(term, node){
  for(c in node.children){
    if(node.children[c].title == term){
      stdOut = node.children[c].id;
    } else{
      re_find(term, node.children[c]);
    }
  }
}

//Add a bookmark in a given area
// IF PARAM: then insert it in the hierarchy under param
// IF NOT PARAM: insert in bookmarks bar
function bu_add( params ){
  if ( params.length === 0 ){
    
  } else {
    
  }
}

//function to navigate to a wikipedia search
//INPUT:
//  params - an array or search terms
function wikipedia_search( params ){
  url="https://en.wikipedia.org/wiki/Special:Search?search=";
  for (i in params){
    url += params[i]+"+";
  }
  url += '\b';
  navigate(url);
}


//function to launch a google search
//INPUT: 
//  params - an array of search terms
function google_search( params ){
  url="https://www.google.com/search?site=&source=hp&q=";
  for (i in params){
    url += params[i]+"+";
  }
  url += '\b';
  navigate(url);
}

//function for settings page access
function settings_load(){
  url="chrome://settings";
  navigate( url );
}


//function for extension page access
function extensions_load(){
  url="chrome://extensions";
  navigate(url);
}

//function to change chrome's browser to specified window
function navigate( loc ){
  //sets current tab url to loc
  chrome.tabs.update({"url":loc});
}












function isGoogleCommand(com){
  if (com == 'google'){
    return true;
  }
  return false;
}


function isBookmarkUtility(com){
  if (com == 'bkmrk'){
    return true;
  }
  return false;
}

function isExtensionsPage(com){
  if (com == 'extensions'){
    return true;
  }
  return false;
}

function isSettingsPage(com){
  if(com == 'settings'){
    return true;
  }
  return false;
}

function isDriveApp(com){
	if (com == 'drive'){
		return true;
	}
	return false;
}

function isMailApp(com){
	if (com == 'mail'){
		return true;
	}
	return false;
}

function isWikiApp(com){
  if (com == 'wiki'){
    return true;
  }
  return false;
}

function upvote(id){
  var xhp = new XMLHttpRequest();
  xhp.open('POST', "/upvote/" + id, false);
  xhp.send();
}

function downvote(id){
  var xhp = new XMLHttpRequest();
  xhp.open('POST', "/downvote/" + id, false);
  xhp.send();
}

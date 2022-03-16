const quote = document.querySelector('#lblQuote');
const auth = document.querySelector('#lblAuth');
const next = document.querySelector('#btnget');
const copy = document.querySelector('#copy');
const share = document.querySelector('#share');
const save  = document.querySelector('#save');
const apptitle =  document.querySelector('#apptitle');


var dquote = '';
var dauth = '';


window.onload = function(){
    GetData();
    GetSaved();
}


next.addEventListener('click', () => {
    GetData();
    
});

save.addEventListener('click', () => {
    
    var uuid = Date.now().toString(36) + Math.random().toString(36).substring(2);

    var db = window.localStorage;
    db.setItem(uuid,quote.textContent)
    myToast('Quote Saved!');
    GetSaved();
    GetData();

});


function copyToClipboard(element) {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($(element).text()).select();
    document.execCommand("copy");
    $temp.remove();
    myToast('Copied successfully!');
  }
  

function changeTitle(boolTab){
    // 0  - Quotes, 1  - Saved

    if (boolTab === true){
        apptitle.innerHTML = '<i class="fas fa-quote-left"></i> Quotely ';
    } else{
        apptitle.innerHTML = '<i class="fas fa-quote-left"></i> Saved Quotes ';

    }
}

function childShare(id){
    navigator.share(document.getElementById(id).textContent, "Be Inpired, Share this quote?")
}
function childCopy(id){
    cordova.plugins.clipboard.copy(document.getElementById(id).textContent);
    myToast('Copied successfully!');
}
function childDelete(id){
    localStorage.removeItem(id);
    myToast('Deleted successfully!')
    GetSaved();
}

function GetSaved(){
    const items = { ...localStorage };
    var quote_html_list = ""
    for (key in localStorage){

        if (localStorage.getItem(key) != null){
                quote_html_list +=   ` <ion-row>
         <ion-col size="12" size-md>
             <ion-card style="top: 5vh;">
                 <ion-card-content>
                     <ion-item lines="none">
                         <ion-label class="childqte" text-wrap id="${key}"  color="tertiary"> ${localStorage.getItem(key)}</ion-label>
                     </ion-item>
                    
                     <ion-item lines="none">
                         <ion-button id="${key}" fill="outline"  color="secondary" onclick="copyToClipboard('#${key}')" class="childqtebtn" onClick="childCopy(this.id)">
                             <i class="fa fa-bookmark-o"></i> &nbsp; Copy
                         </ion-button> &nbsp;
                         <ion-button id="${key}" fill="outline"  color="secondary" class="childqtebtn" onClick="childDelete(this.id)">
                             <i class="fa fa-bookmark-o"></i> &nbsp; Delete
                         </ion-button>
                     </ion-item>
                 </ion-card-content>
             </ion-card>
         </ion-col>
     </ion-row>`
        }
    }

    
    document.getElementById('savedQuotesList').innerHTML = quote_html_list;
}

function GetData() {
    
    $.getJSON("https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=jsonp&jsonp=?",
        function (data, textStatus, jqXHR) {
            quote.innerHTML = ' <i class="fas fa-quote-left"></i> ' + data.quoteText + '<i class="fas fa-quote-right"></i>';
            dauth = data.quoteAuthor
            if (dauth === "") {
                dauth = "Unknown"
                
            }
            auth.innerHTML = '<i class="fas fa-pen-square"></i>&nbsp;By, ' + dauth;
        }
    );


};

  async function myToast(msg) {
    const toast = document.createElement('ion-toast');
    toast.message = msg;
    toast.duration = 2000;
    toast.position= 'top';
  
    document.body.appendChild(toast);
    return toast.present();
  }



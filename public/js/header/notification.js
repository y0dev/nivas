let notifiers = document.querySelectorAll(".notifier");


notifiers.forEach((notifier) => {
    notifier.addEventListener("click", function () {
        console.log('notification');
    });
});

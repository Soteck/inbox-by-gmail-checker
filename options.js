function restoreOptions() {
  chrome.storage.sync.get({
    defaultUser: '0',
    pollInterval: '3',
    quietHours: '',
    distractionFreeMinutes: '30',
    useSnoozeColor: true,
    useDesktopNotifications: true,
    openInEmptyTab: false
  }, function(items) {
    document.getElementById('defaultUser').value = items.defaultUser;
    document.getElementById('pollInterval').value = items.pollInterval || 3;
    document.getElementById('quietHours').value = items.quietHours;
    document.getElementById('distractionFreeMinutes').value = items.distractionFreeMinutes || 30;
    document.getElementById('useSnoozeColor').checked = !!items.useSnoozeColor;
    document.getElementById('useDesktopNotifications').checked = !!items.useDesktopNotifications;
    document.getElementById('openInEmptyTab').checked = !!items.openInEmptyTab;
  });
}

function saveOptions(e) {
  e.preventDefault();

  // Normalize
  var defaultUser = Math.max(0, parseInt(document.getElementById('defaultUser').value) || 0);
  var pollInterval = Math.max(0, Math.min(3600, parseInt(document.getElementById('pollInterval').value) || 3));
  var quietHours = document.getElementById('quietHours').value;
  var distractionFreeMinutes = Math.max(1, Math.min(1440, parseInt(document.getElementById('distractionFreeMinutes').value) || 30));
  var useSnoozeColor = document.getElementById('useSnoozeColor').checked;
  var useDesktopNotifications = document.getElementById('useDesktopNotifications').checked;
  var openInEmptyTab = document.getElementById('openInEmptyTab').checked;
  chrome.storage.sync.set({
    defaultUser: defaultUser,
    pollInterval: pollInterval,
    quietHours: quietHours,
    distractionFreeMinutes: distractionFreeMinutes,
    useSnoozeColor: useSnoozeColor,
    useDesktopNotifications: useDesktopNotifications,
    openInEmptyTab: openInEmptyTab
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 3000);
  });

  // Show normalized values
  restoreOptions();
  return false;
}

function defaultOptions() {
  document.getElementById('defaultUser').value = 0;
  document.getElementById('pollInterval').value = 3;
  document.getElementById('quietHours').value = '';
  document.getElementById('distractionFreeMinutes').value = 30;
  document.getElementById('useSnoozeColor').checked = true;
  document.getElementById('useDesktopNotifications').checked = true;
  document.getElementById('openInEmptyTab').checked = false;
}

function main() {
  if (!chrome || !chrome.storage || !chrome.storage.sync) {
    var status = document.getElementById('status');
    status.style.cssText = 'color:red;';
    status.textContent = 'Error: Could not load settings. Please upgrade Chrome.';
    return;
  }
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('defaults').addEventListener('click', defaultOptions);
  document.getElementById('optionsForm').addEventListener('submit', saveOptions);
  document.getElementById('exampleQuietHours').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('quietHours').value = '9,10,11,12,13,14,15,16,17,18';
    return false;
  });
}

main();

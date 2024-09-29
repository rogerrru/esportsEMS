
# VALORANT LEADERBOARDS USING VARIOUS APIs

---

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents
- [OVERVIEW](#overview)
- [LEADERBOARDS](#leaderboards)
- [AGENTS](#agents)
- [SUPPORT](#support)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

---
## OVERVIEW
This section contains the news and latest updates of VALORANT esports

---
## LEADERBOARDS
This section container the leaderboards of players and teams in the valorant game.

---
## AGENTS
This section contains the playable characters and their information

---
## SUPPORT
How to Setup Website
1. Install and run WampServer
2. Create a new file in the {C:/wamp64/www} folder
3. Name the file proxy.php
4. Input the ff.
   ```
   <?php
   // Enable CORS (Cross-Origin Resource Sharing)
   header("Access-Control-Allow-Origin: *");
   header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
   header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
   // Get the 'url' query parameter from the request
   $apiUrl = $_GET['url'];
   if (empty($apiUrl)) {
   echo "Missing 'url' query parameter.";
   exit;
   }
   // Forward the request to the target API
   $response = file_get_contents($apiUrl);
   echo $response;
5. Restart WampServer
6. You are good to go!

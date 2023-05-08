<?php declare (strict_types = 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token");
?>
<?php

$host = 'db';
$port = 1080;
$user = 'root';
$pass = 'lionPass';
$dbname = 'blogdb';

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) {
    die("<div>Connection failed: {$conn->connect_error}</div>");
}
;

if ($_SERVER["REQUEST_METHOD"] == "GET" && $_GET["action"] == "posts") {
    (new blogAPI())->getAllPosts($conn);
}

class blogAPI
{
    public function getAllPosts($conn)
    {
        $sql = "
        select posts.id as post_id, posts.user as post_user, posts.post as post, comments.user as comment_user, comments.comment as comment from posts
        left join comments on posts.id = comments.referencePostId
        ";

        $result = mysqli_query($conn, $sql);
        if ($result) {
            if (mysqli_num_rows($result) != 0) {
                $posts = array();
                while ($row = mysqli_fetch_assoc($result)) {
                    $post_id = $row["post_id"];
                    $post_user = $row["post_user"];
                    $post = $row["post"];
                    $comment_user = $row["comment_user"];
                    $comment = $row["comment"];

                    if (!isset($posts[$post_id])) {
                        $posts[$post_id] = array(
                            "post_user" => $post_user,
                            "post" => $post,
                            "comments" => array(),
                        );
                    }

                    if ($comment_user !== null && $comment !== null) {
                        $comment_data = array(
                            "comment_user" => $comment_user,
                            "comment" => $comment,
                        );
                        array_push($posts[$post_id]["comments"], $comment_data);
                    }
                }
                http_response_code(200);
                header("Content-Type: application/json");
                echo json_encode($posts);
            } else {
                http_response_code(204);
                header("Content-Type: application/json");
            }
        } else {
            http_response_code(500);
            header("Content-Type: application/json");
            $response["success"] = false;
            $response["message"] = "Error: " . $conn->error;
        }
    }
};

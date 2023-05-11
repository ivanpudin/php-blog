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

class blogAPI
{
    public function getPosts($conn)
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
                            "post_id" => $post_id,
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

    public function createComment($conn, $data)
    {
        $referencePostId = htmlspecialchars($data["referencePostId"]);
        $user = htmlspecialchars($data["user"]);
        $comment = htmlspecialchars($data["comment"]);
        if (!mb_strlen($user) || !mb_strlen($comment)) {
            http_response_code(400);
            echo json_encode(array("message" => "Comment fields cannot be empty."));
        } else {
            $stmt = $conn->prepare("SELECT * FROM `comments` WHERE `referencePostId`=? AND `user`=? AND `comment`=?");
            $stmt->bind_param("sss", $referencePostId, $user, $comment);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result) {
                if ($result->num_rows != 0) {
                    http_response_code(409);
                    header("Content-Type: application/json");
                    $response["message"] = "Comment already exists.";
                    echo json_encode($response);
                } else {
                    $stmt = $conn->prepare("INSERT INTO `comments` (`referencePostId`, `user`, `comment`) VALUES (?, ?, ?)");
                    $stmt->bind_param("sss", $referencePostId, $user, $comment);
                    if ($stmt->execute()) {
                        http_response_code(201);
                        header("Content-Type: application/json");
                        $response["success"] = true;
                        $response["message"] = "Comment has been posted";
                        echo json_encode($response);
                    } else {
                        http_response_code(500);
                        header("Content-Type: application/json");
                        $response["success"] = false;
                        $response["message"] = "Error: " . $stmt->error;
                        echo json_encode($response);
                    }
                }
            }
        }
    }
};

if ($_SERVER["REQUEST_METHOD"] == "GET" && $_GET["action"] == "posts") {
    (new blogAPI())->getPosts($conn);
}
;

if ($_SERVER["REQUEST_METHOD"] == "POST" && $_SERVER["CONTENT_TYPE"] == 'application/json') {
    $content = file_get_contents("php://input");
    $data = json_decode($content, true);
    $action = htmlspecialchars($data["action"]);
    if ($action == 'create-comment') {
        (new blogAPI())->createComment($conn, $data);
    }
}

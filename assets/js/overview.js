// Fetch the first 6 data items
const newsContainer = document.querySelector(".news-container");
const loadMoreContainer = document.querySelector(".load-more-container");
const newsImg = [{
img2: "https://images.contentstack.io/v3/assets/bltb730eada072bdbf4/blta2f909174a704e58/64d95210092e81ce6e64aabf/3artigochallengers.jpg?width=1440&height=810",
img3: "https://images.contentstack.io/v3/assets/bltb730eada072bdbf4/bltcd97590cc1bb7a83/64d55fd5fe29dd9d4130f4fd/VCT_OffSeason_2022_Header.jpg?width=1440&height=810",
img4: "https://images.contentstack.io/v3/assets/bltb730eada072bdbf4/blt44454a513589fbde/64c29614570512e1c0dd6bff/VCT23_Champions_WPEArticle.jpg?width=1440&height=810",
img5: "https://images.contentstack.io/v3/assets/bltb730eada072bdbf4/blt0f23884855beb301/64c1de390c8acef375030160/CH23_CoverImage.jpg?width=1844&height=",
img6: "https://images.contentstack.io/v3/assets/bltb730eada072bdbf4/blt4894c511841f265d/64a7caca873fa3f0af02f2af/070723_VCTP_LCQ_TicketSales_Banner.jpg?width=1038&height=",
img7: "https://images.contentstack.io/v3/assets/bltb730eada072bdbf4/blt1b87f517158287e2/64a2772fe64f41010042ee82/VCTP_-_LCQ_EYNTK_Article_Banner.jpg?width=1038&height=",
img8: "https://images.contentstack.io/v3/assets/bltb730eada072bdbf4/bltdceaeb9d64806fdb/649ba1c7a60a794675411c1e/VCT_ASC_Co_Streaming_Article_Thumbnail_Ver_2.jpg?width=1038&height=",
img9: "https://images.contentstack.io/v3/assets/bltb730eada072bdbf4/blt09bee10be2693872/6492a35aee6549c25cccee1c/VCT23_Masters_GrandFinals_ArticleHeader.png?width=1038&height=",
img10: "https://images.contentstack.io/v3/assets/bltb730eada072bdbf4/blt4ebcc19a1c4fa248/648b46c1d5b9a5a8356dd0a7/VCT23_Masters_Showmatch_ArticleHeader.jpg?width=1038&height=",
img11: "https://images.contentstack.io/v3/assets/bltb730eada072bdbf4/blt9d090b931c9415bb/648cc296f71d772f7200391a/VCT23_Tickets.jpg?width=1038&height=",
img1: "https://images.contentstack.io/v3/assets/bltb730eada072bdbf4/blt94e1b391ba7709b8/651f414c024b46c5f3de3b2d/GCC23_Ticket_Announcement.jpg?width=1440&height=810"
}
]
let data = [];
let startIndex = 0;
const itemsPerPage = 6;

function fetchNews() {
    const proxyServerUrl = 'http://localhost/proxy/proxy.php?url=https://vlrggapi.vercel.app/news';
    fetch(proxyServerUrl)
        .then((response) => response.json())
        .then((fetchedData) => {
            data = fetchedData;

            if (data && data.data && data.data.segments) {
                const segments = data.data.segments.slice(startIndex, startIndex + itemsPerPage);

                segments.forEach((news, index) => {
                    const newsItem = document.createElement('div');
                    newsItem.classList.add('indie-news-container');

                    // Use the modulo operator to repeat images when there are more news items than images
                    const imgIndex = index % Object.keys(newsImg[0]).length + 1;
                    const imgSrc = newsImg[0][`img${imgIndex}`];

                    newsItem.innerHTML = `
                    <a class="news-item" href="https://www.vlr.gg${news.url_path}" target="_blank">
                        <div class="news-image">
                            <img src="${imgSrc}" alt="${news.title}">
                        </div>
                        <div class="news-details">
                            <div class="news-meta">
                                <span class="news-date">${news.date}</span>
                            </div>
                            <div class="news-title">
                                <h1>
                                    ${news.title}
                                </h1>
                            </div>
                            <div class="news-content">
                                <span>${news.description}</span>
                            </div>
                            <div class="read-more">
                                <h3>READ MORE</h3>
                            </div>
                        </div>
                    </a>
                    `;

                    newsContainer.appendChild(newsItem);
                });

                // Increment the startIndex for the next load
                startIndex += itemsPerPage;

                // Show the "Load More" button if there is more data to load
                if (startIndex < data.data.segments.length) {
                    document.querySelector('.load-more-button').style.display = 'block';
                } else {
                    // Hide the button if no more data is available
                    document.querySelector('.load-more-button').style.display = 'none';
                }
            } else {
                console.error('Data does not contain a "segments" array:', data);
            }
        })
        .catch((error) => {
            console.error('Fetch error:', error);
        });
}


// Create and append the "Load More" button
const loadMoreButton = document.createElement('button');
loadMoreButton.classList.add('load-more-button');
loadMoreButton.textContent = 'Load More';
loadMoreButton.style.display = 'none'; // Initially hide the button
loadMoreButton.addEventListener('click', fetchNews);
loadMoreContainer.appendChild(loadMoreButton);

// Load initial data on page load
window.addEventListener('load', () => {
    fetchNews();
});
function changeBackgroundImage(imageUrl) {
    const body = document.body;
    body.style.backgroundColor = `${imageUrl}`;
    body.style.backgroundImage = "none";
}
changeBackgroundImage("#0f1519");
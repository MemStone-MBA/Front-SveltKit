<script>
    import { onMount } from 'svelte';
    
    let cards = [];
    let error = null
    
    onMount(async () => {
        /**
         * Parse the response to JSON
         * @param resp
         */
        const parseJSON = (resp) => (resp.json ? resp.json() : resp);

        /**
         * Check if response is OK
         * @param resp
         */
        const checkStatus = (resp) => {
            if (resp.status >= 200 && resp.status < 300) {
            return resp;
            }
            return parseJSON(resp).then((resp) => {
            throw resp;
            });
        };
    
        /**
         * Get request
        */
        try {
            const res = await fetch("http://localhost:1337/cards", {
              method: "GET",
              headers: {
                 'Content-Type': 'application/json'
              },
            }).then(checkStatus)
          .then(parseJSON);
          cards = res
        } catch (e) {
            error = e
        }
    });
    </script>
    
    {#if error !== null}
      {error}
    {:else}
      <table>

        <tr>
            <th>Name</th>
            <th>Life</th>
            <th>Damage</th>
        </tr>

      {#each cards as card}
        <tr>
            <td>{card.name}</td>
            <td>{card.life}</td>
            <td>{card.damage}</td>
        </tr>
      {/each}
      </table>
    {/if}

    <style>
        th {
            background-color: rgb(179, 179, 179);
        }

        th, td {
            padding: 5px;
            border: 2px solid rgb(29, 29, 29)
        }
    </style>
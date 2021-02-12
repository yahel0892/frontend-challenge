import axios from "axios";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import Paper from "@material-ui/core/Paper";
import offerListUrl from "../../settings/env";
import "../../index.scss";

const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.common.blue,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 16,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        "&:nth-of-type(odd)": {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

// A utility function is created so that we don't have to create dozens of different methods:
// Sort ascending
function sortAsc(arr, field) {
    return arr.sort(function (a, b) {
        if (a[field] > b[field]) {
            return 1;
        }
        if (b[field] > a[field]) {
            return -1;
        }
        return 0;
    });
}

// Sort descending
function sortDesc(arr, field) {
    return arr.sort(function (a, b) {
        if (a[field] > b[field]) {
            return -1;
        }
        if (b[field] > a[field]) {
            return 1;
        }
        return 0;
    });
}

export default function DirectoryList({ offerList, ...props }) {
    let sorted = [];
    // log.debug("Here is your offers list", offerList);
    const [offers, setOffers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        axios
            .get(offerListUrl.list)
            .then(resp => {
                setOffers(resp.data.data);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const changePage = (event, newPage) => {
        setPage(newPage);
    };
    const changeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // Select method to order
    const selectOrderMethod = event => {
        switch (event.target.value) {
            case "A-Z": // Sort alphabetically from A to Z
                sorted = sortAsc([...offers], "name");
                setOffers(sorted);

                break;
            case "Z-A": // Sort alphabetically from Z to A
                sorted = sortDesc([...offers], "name");
                setOffers(sorted);

                break;
            case "discount-mayor": // Sort discounts from highest to lowestp
                sorted = sortDesc([...offers], "discount");
                setOffers(sorted);

                break;
            case "discount-minor": // Sort discounts from lowest to highest
                sorted = sortAsc([...offers], "discount");
                setOffers(sorted);

                break;
            default:
                return setOffers([...offers]);
        }
    };

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, offers.length - page * rowsPerPage);

    if (isLoading) {
        return (
            <div>
                <p className="loaderText blink">Loading...</p>
                <div className="loaderText">
                    <CircularProgress color="ligth" />
                </div>
            </div>
        );
    }
    return (
        <>
            <section>
                <select
                    name="selectOrder"
                    className="selectButton"
                    onChange={selectOrderMethod}>
                    <option disabled selected>
                        <b>Order by</b>
                    </option>
                    <option value="A-Z">Alphabet - A-Z</option>
                    <option value="Z-A">Alphabet - Z-A</option>
                    <option value="discount-minor">
                        Discount - Lowest to Highest
                    </option>
                    <option value="discount-mayor">
                        Discount - Highest to Lowest
                    </option>
                </select>
            </section>

            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead style="background-color: #3759F3;">
                        <TableRow>
                            <StyledTableCell>
                                <b>Offers</b>
                            </StyledTableCell>
                            <StyledTableCell>
                                <b>Discount</b>
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {offers
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage,
                            )
                            .map((row, index) => (
                                <StyledTableRow key={row.name} hover>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell>
                                        {row.discount ? row.discount : 0}
                                    </TableCell>
                                </StyledTableRow>
                            ))}
                        {emptyRows > 0 && (
                            <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[
                        5,
                        10,
                        20,
                        { value: -1, label: "All" },
                    ]}
                    component="div"
                    count={offers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={changePage}
                    onChangeRowsPerPage={changeRowsPerPage}
                />
            </TableContainer>
        </>
    );
}

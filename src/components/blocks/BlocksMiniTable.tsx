import {
  Button,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import React, { useEffect } from "react";
import { blocksState } from "../../state/blocks";
import { useRecoilState } from "recoil";
import { shortenHash } from "../../utils/shortenHash";
import {
  convertTimestampToTimeFromNow,
  formatDate,
} from "../../utils/convertTimestampToTimeFromNow";
import { useNavigate } from "react-router-dom";
import { getBlocks } from "../../services/blocksService";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

type Page = {
  limit: number;
  offset: number;
};

function BlocksMiniTable() {
  const [blocks, setBlocks] = useRecoilState(blocksState);
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [pagination, setPagination] = React.useState({
    limit: 10,
    offset: 0,
  } as Page);

  useEffect(() => {
    const getBlocksAndSetState = async (limit: number, offset: number) => {
      const blocks = await getBlocks(limit, offset, {});
      setBlocks(blocks);
    };
    getBlocksAndSetState(pagination.limit, pagination.offset);
    const interval = setInterval(async () => {
      await getBlocksAndSetState(pagination.limit, pagination.offset);
    }, 10000);
    return () => clearInterval(interval);
  }, [pagination.offset, pagination.limit, pagination, setBlocks]);

  function getPreviousPage() {
    if (pagination.offset === 0) {
      return;
    }
    setPagination({
      ...pagination,
      offset: pagination.offset - pagination.limit,
    });
  }

  function getNextPage() {
    setPagination({
      ...pagination,
      offset: pagination.offset + pagination.limit,
    });
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell colSpan={5}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <h3 style={{ float: "left" }}>Blocks</h3>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    onClick={() => navigate("/blocks")}
                    style={{
                      float: "right",
                      marginTop: "8px",
                    }}
                  >
                    View all
                  </Button>
                </Grid>
              </Grid>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Hash</TableCell>
            <TableCell>Height</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blocks.map((block: any) => (
            <TableRow key={block.id}>
              <TableCell>{block.id}</TableCell>
              <TableCell>{shortenHash(block.hash)}</TableCell>
              <TableCell>{block.height}</TableCell>
              <TableCell>
                <Tooltip placement="top" title={formatDate(block.created_at)}>
                  <span>{convertTimestampToTimeFromNow(block.created_at)}</span>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>
              <>
                <IconButton
                  disabled={pagination.offset === 0}
                  onClick={() => getPreviousPage()}
                >
                  <ChevronLeft />
                </IconButton>
                <IconButton onClick={() => getNextPage()}>
                  <ChevronRight />
                </IconButton>
              </>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
}

export default BlocksMiniTable;
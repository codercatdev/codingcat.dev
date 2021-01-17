import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  makeStyles,
  createStyles,
  Button,
  Box,
  Theme,
} from '@material-ui/core';
import { red, grey } from '@material-ui/core/colors';

import YouTubeIcon from '@material-ui/icons/YouTube';
import { userYouTubeApiToken } from '@/services/api';
import { UserInfoExtended } from '@/models/user.model';
import { useUser } from '@/utils/auth/useUser';
import React, { useEffect, useMemo, useState } from 'react';
import { Observable } from 'rxjs';
import { useDropzone } from 'react-dropzone';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    authorize: {
      backgroundColor: grey[500],
      '&:hover': {
        backgroundColor: grey[300],
      },
    },
    youtube: {
      backgroundColor: red[500],
      '&:hover': {
        backgroundColor: red[300],
      },
    },
    baseStyle: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      borderWidth: 4,
      borderRadius: 4,
      borderColor: theme.palette.primary.main,
      borderStyle: 'dashed',
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      outline: 'none',
      transition: 'border .24s ease-in-out',
    },
    activeStyle: {
      borderColor: '#2196f3',
    },
    acceptStyle: {
      borderColor: '#00e676',
    },
    rejectStyle: {
      borderColor: '#ff1744',
    },
  })
);

export default function YouTubeUpload(): JSX.Element {
  const { user }: { user: UserInfoExtended | null | undefined } = useUser();
  const [token, setToken] = useState<{ refresh_token: string } | null>(null);
  const [userToken$, setUserToken$] = useState<Observable<{
    refresh_token: string;
  }> | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && user.uid) {
      setUserToken$(userYouTubeApiToken(user));
    }
  }, [user]);

  useEffect(() => {
    if (!userToken$) {
      return;
    }
    const sub = userToken$.subscribe((t) => {
      if (t && t.refresh_token) {
        setToken(t);
      } else {
        setToken(null);
      }
    });
    return () => {
      if (sub) sub.unsubscribe();
    };
  }, [userToken$]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
    acceptedFiles,
  } = useDropzone({
    accept: 'video/*',
    maxFiles: 1,
  });

  const acceptedFileItems = acceptedFiles.map((file: any) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const router = useRouter();
  const classes = useStyles();

  const dragClass = useMemo(
    () =>
      `${classes.baseStyle} ${isDragActive ? 'activeStyle' : ''} ${
        isDragAccept ? 'acceptStyle' : ''
      } ${isDragReject ? 'rejectStyle' : ''}`,
    [isDragActive, isDragReject, isDragAccept]
  );

  return (
    <>
      {user && user.uid && !token?.refresh_token ? (
        <Button
          variant="contained"
          className={classes.authorize}
          onClick={() => router.push('/auth/youtube')}
        >
          <Box
            sx={{
              paddingRight: '0.5rem',
            }}
          >
            Authorize YouTube
          </Box>
          <YouTubeIcon />
        </Button>
      ) : (
        <>
          <Button
            variant="contained"
            className={classes.youtube}
            onClick={handleOpen}
          >
            <Box
              sx={{
                paddingRight: '0.5rem',
              }}
            >
              Add YouTube Cover
            </Box>
            <YouTubeIcon />
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              YouTube Video Upload
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                This video will first be uploaded to our servers. Then you can
                choose which meta data should be used on YouTube when
                publishing. If you need to update this data you can visit our{' '}
                {''}
                <Link href="/youtube">
                  <a>YouTube Management</a>
                </Link>
              </DialogContentText>
              <Box>
                <section className="container">
                  <div {...getRootProps({ className: dragClass })}>
                    <input {...getInputProps()} />
                    <p>
                      Drag &lsquo;n&lsquo; drop your video here, or click to
                      select files
                    </p>
                  </div>
                  <aside>
                    <h4>Accepted files</h4>
                    <ul>{acceptedFileItems}</ul>
                  </aside>
                </section>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button color="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleClose}>
                Subscribe
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </>
  );
}
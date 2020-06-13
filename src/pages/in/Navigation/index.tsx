/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import Helmet from "react-helmet";
import Select from "react-select";
import { GetAppName, CleanMessage } from "../../../context/App";
import IconInput from "../../partials/IconInput";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_NAVIGATION_LIST, CREATE_NAVIGATION } from "../../../queries/navigation.query";
import { toast } from "react-toastify";
import NavigationList from "./items";
import LoadingState from "../../partials/loading";
import Pagination from "./../../partials/Pagination";

const Navigation = () => {
    const [page, setPage] = useState(1);
    const [limit] = useState(25);
    const [desc, setDesc] = useState<string>();
    const [roles, setRole] = useState([]);
    const [groups, setGroups] = useState([]);
    const [newModel, setModel] = useState({ name: "", icon: "", role: "", group: "", desc: "", path: "" });

    const { loading, fetchMore, data, refetch } = useQuery(GET_NAVIGATION_LIST, {
        variables: { page, limit },
        notifyOnNetworkStatusChange: true,
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: (d) => {
            // role
            setRole(
                d.GetRoles.docs.map((role: any) => ({
                    label: role.name,
                    value: role.id,
                }))
            );
            // navigation group
            setGroups(
                d.GetNavigationGroups.docs.map((group: any) => ({
                    label: group.name,
                    value: group.id,
                }))
            );
        },
    });

    const [createFunc, { loading: newLoading }] = useMutation(CREATE_NAVIGATION, {
        onError: (e) => toast.error(CleanMessage(e.message)),
        onCompleted: async (d) => {
            if (d.NewNavigation) {
                toast.success(d.NewNavigation.message);
                await refetch();
                setModel({ name: "", path: "", icon: "", desc: "", group: "", role: "" });
            }
        },
    });

    useEffect(() => {
        fetchMore({
            variables: { page, limit },
            updateQuery(prev, { fetchMoreResult }) {
                if (!fetchMoreResult) return prev;
                return { GetNavigationList: fetchMoreResult.GetNavigationList };
            },
        });
    }, [page, fetchMore, limit]);

    return (
        <>
            <Helmet>
                <title>Navigation | {GetAppName()}</title>
            </Helmet>
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <div className="content-i">
                        <div className="content-box">
                            <div className="element-wrapper">
                                <span className="element-actions">
                                    <button className="btn btn-primary" data-target="#NewNavigationModal" data-toggle="modal" type="button">
                                        Create New
                                    </button>
                                </span>
                                <h5 className="element-header">Navigation</h5>
                                <div className="row justify-content-center ">
                                    <div className="col-lg-12">
                                        <LoadingState loading={loading} />
                                        <div className="element-box-tp">
                                            {!loading && data && (
                                                <NavigationList
                                                    onView={(item: any) => setDesc(item.desc)}
                                                    onRemove={() => {
                                                        if (window.confirm("Are you sure you want to proceed?")) {
                                                        }
                                                    }}
                                                    items={data.GetNavigationList.docs}
                                                />
                                            )}
                                        </div>

                                        {data && data.GetNavigationList.totalDocs > 0 && (
                                            <div className="element-box fade-in">
                                                <Pagination onPageClicked={(page: number) => setPage(page)} {...data.GetNavigationList} length={data.GetNavigationList.totalDocs} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* New Navigation Modal */}
            <div aria-hidden="true" className="modal fade" id="NewNavigationModal" role="dialog">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">New Navigation</h5>
                            <button aria-label="Close" className="close" data-dismiss="modal" type="button">
                                <span aria-hidden="true"> ×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <LoadingState loading={newLoading} />
                            <form
                                onSubmit={async (event) => {
                                    event.preventDefault();
                                    //
                                    await createFunc({ variables: { model: newModel } });
                                }}
                            >
                                <div className="row">
                                    <div className="col-lg-6">
                                        <IconInput
                                            placeholder="Enter name"
                                            label="Name"
                                            initVal={newModel.name}
                                            icon="os-icon-phone"
                                            required={true}
                                            type="text"
                                            onChange={(name: string) => setModel({ ...newModel, name })}
                                        />
                                    </div>
                                    <div className="col-lg-6">
                                        <IconInput
                                            placeholder="Enter path"
                                            label="Path"
                                            icon="os-icon-phone"
                                            initVal={newModel.path}
                                            required={true}
                                            type="text"
                                            onChange={(path: string) => setModel({ ...newModel, path })}
                                        />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label htmlFor="group">Navigation Group</label>
                                            <Select
                                                isMulti={false}
                                                onChange={(item: any) => {
                                                    setModel({ ...newModel, group: item.value });
                                                }}
                                                options={groups}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label htmlFor="role">Roles</label>
                                            <Select isMulti={false} options={roles} onChange={(items: any) => setModel({ ...newModel, role: items.value })} />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <IconInput
                                            placeholder="Enter icon (os-icon only)"
                                            label="Icon"
                                            icon="os-icon-phone"
                                            required={true}
                                            type="text"
                                            onChange={(icon: string) => setModel({ ...newModel, icon })}
                                        />
                                    </div>
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label> Description </label>
                                            <textarea
                                                onChange={({ currentTarget: { value } }) => setModel({ ...newModel, desc: value })}
                                                className="form-control"
                                                placeholder="Enter description"
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>

                                <button className="btn btn-primary" type="submit">
                                    Save New
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Description Modal */}
            <div aria-hidden="true" className="modal fade" id="DescriptionModal" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Navigation Description</h5>
                            <button aria-label="Close" className="close" data-dismiss="modal" type="button">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>{desc}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navigation;
